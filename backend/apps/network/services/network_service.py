import ipaddress
import socket


class LocalNetworkService:
    """Detect the server IPv4 address and build its frontend URL."""

    frontend_port = 5173
    backend_port = 8000

    def get_network_addresses(self) -> dict[str, str]:
        ip_address = self.get_ipv4_address()
        return {
            "ip_address": ip_address,
            "frontend_address": f"http://{ip_address}:{self.frontend_port}/",
            "backend_address": f"http://{ip_address}:{self.backend_port}/",
            "query": f"{ip_address}:{self.backend_port}",
        }

    def get_frontend_url(self) -> str:
        return f"http://{self.get_ipv4_address()}:{self.frontend_port}/"

    def get_ipv4_address(self) -> str:
        routed_address = self._get_routed_address()
        if routed_address:
            return routed_address

        hostname_address = self._get_hostname_address()
        if hostname_address:
            return hostname_address

        return "127.0.0.1"

    def _get_routed_address(self) -> str | None:
        network_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            network_socket.connect(("192.0.2.1", 80))
            return self._valid_ipv4(network_socket.getsockname()[0])
        except OSError:
            return None
        finally:
            network_socket.close()

    def _get_hostname_address(self) -> str | None:
        try:
            return self._valid_ipv4(socket.gethostbyname(socket.gethostname()))
        except OSError:
            return None

    @staticmethod
    def _valid_ipv4(address: str) -> str | None:
        try:
            parsed_address = ipaddress.IPv4Address(address)
        except ipaddress.AddressValueError:
            return None
        return str(parsed_address) if not parsed_address.is_unspecified else None
