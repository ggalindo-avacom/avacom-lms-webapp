import ipaddress
import platform
import re
import socket
import subprocess

from django.conf import settings

from apps.network.services.genqr import generate_wifi_qr_payload, normalize_encryption


class LocalNetworkService:
    """Detect the server IPv4 address and build its frontend URL."""

    frontend_port = 5173
    backend_port = 8000

    def get_network_addresses(self) -> dict[str, object]:
        ip_address = self.get_ipv4_address()
        return {
            "ip_address": ip_address,
            "frontend_address": f"http://{ip_address}:{self.frontend_port}/",
            "backend_address": f"http://{ip_address}:{self.backend_port}/",
            "query": f"{ip_address}:{self.backend_port}",
            "wifi": self.get_wifi_information(),
        }

    def get_wifi_information(self) -> dict[str, str | None]:
        ssid = self.get_current_wifi_name()
        password = settings.WIFI_PASSWORD
        encryption = normalize_encryption(settings.WIFI_ENCRYPTION)
        qr_payload = None

        if ssid:
            qr_payload = generate_wifi_qr_payload(
                ssid=ssid,
                password=password,
                encryption=encryption,
            )

        return {
            "ssid": ssid,
            "password": password,
            "encryption": encryption,
            "qr_payload": qr_payload,
        }

    def get_current_wifi_name(self) -> str | None:
        operating_system = platform.system()
        if operating_system == "Windows":
            return self._get_windows_ssid()
        if operating_system == "Linux":
            return self._get_linux_ssid()
        if operating_system == "Darwin":
            return self._get_macos_ssid()
        return None

    def _get_windows_ssid(self) -> str | None:
        command_output = self._run_command(["netsh", "wlan", "show", "interfaces"])
        ssid_match = re.search(r"^\s*SSID\s*:\s*(.+?)\s*$", command_output, re.MULTILINE)
        return ssid_match.group(1) if ssid_match else None

    def _get_linux_ssid(self) -> str | None:
        command_output = self._run_command(["iwgetid", "--raw"])
        return command_output or None

    def _get_macos_ssid(self) -> str | None:
        command_output = self._run_command(
            [
                "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport",
                "-I",
            ]
        )
        ssid_match = re.search(r"^\s*SSID:\s*(.+?)\s*$", command_output, re.MULTILINE)
        return ssid_match.group(1) if ssid_match else None

    @staticmethod
    def _run_command(command: list[str]) -> str:
        try:
            completed_command = subprocess.run(
                command,
                capture_output=True,
                check=False,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                encoding="utf-8",
                errors="replace",
                shell=False,
                timeout=5,
            )
        except (OSError, subprocess.SubprocessError):
            return ""
        return completed_command.stdout.strip() if completed_command.returncode == 0 else ""

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
