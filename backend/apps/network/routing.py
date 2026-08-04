from django.urls import path

from apps.network.consumers import StudentPresenceConsumer

websocket_urlpatterns = [
    path("ws/network/student-presence/", StudentPresenceConsumer.as_asgi()),
]
