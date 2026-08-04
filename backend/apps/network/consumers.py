"""Presencia de estudiantes en vivo, sin base de datos ni Redis.

El registro vive en memoria del proceso de Django (runserver es un solo
proceso), y el conteo es por host: varias pestañas del mismo equipo cuentan
como un solo estudiante.
"""

import asyncio

from channels.generic.websocket import AsyncJsonWebsocketConsumer

PRESENCE_GROUP = "student-presence"

# Paso 1: registro en memoria { ip_del_host: {ids_de_conexion} }.
_connections_by_host = {}
_registry_lock = asyncio.Lock()


def _count_hosts():
    return len(_connections_by_host)


class StudentPresenceConsumer(AsyncJsonWebsocketConsumer):
    """WS en /ws/network/student-presence/.

    role=student (KitLoginPage) suma presencia; role=watcher (HomePage)
    solo escucha el conteo.
    """

    async def connect(self):
        # Paso 2: identificar el host por su IP y el rol por el query string.
        query = self.scope.get("query_string", b"").decode()
        self.is_student = "role=watcher" not in query
        self.host = (self.scope.get("client") or ["?"])[0]

        await self.channel_layer.group_add(PRESENCE_GROUP, self.channel_name)
        await self.accept()

        # Paso 3: registrar la conexión; solo se difunde si cambia el conteo
        # (una pestaña extra del mismo host no cambia nada).
        if self.is_student:
            async with _registry_lock:
                previous = _count_hosts()
                _connections_by_host.setdefault(self.host, set()).add(self.channel_name)
                changed = _count_hosts() != previous

            if changed:
                await self._broadcast_count()

        # Paso 4: quien se conecta recibe el conteo actual de inmediato.
        await self.send_json({"count": _count_hosts()})

    async def disconnect(self, code):
        await self.channel_layer.group_discard(PRESENCE_GROUP, self.channel_name)

        # Paso 5: al cerrar la última pestaña del host, el host deja de contar.
        if self.is_student:
            async with _registry_lock:
                previous = _count_hosts()
                connections = _connections_by_host.get(self.host)

                if connections is not None:
                    connections.discard(self.channel_name)
                    if not connections:
                        del _connections_by_host[self.host]

                changed = _count_hosts() != previous

            if changed:
                await self._broadcast_count()

    async def _broadcast_count(self):
        await self.channel_layer.group_send(
            PRESENCE_GROUP,
            {"type": "presence.count", "count": _count_hosts()},
        )

    async def presence_count(self, event):
        # Paso 6: cada cambio llega en vivo a todos los conectados.
        await self.send_json({"count": event["count"]})
