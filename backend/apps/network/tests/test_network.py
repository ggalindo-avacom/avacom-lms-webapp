from unittest.mock import patch

from django.test import SimpleTestCase, override_settings
from rest_framework.test import APISimpleTestCase

from apps.network.services import LocalNetworkService, generate_wifi_qr_payload


class WifiQrPayloadTests(SimpleTestCase):
    def test_generates_android_ios_wifi_payload(self):
        payload = generate_wifi_qr_payload(
            ssid="AVACOM;Guests",
            password="secret:2026",
            encryption="WPA2",
        )

        self.assertEqual(
            payload,
            r"WIFI:T:WPA;S:AVACOM\;Guests;P:secret\:2026;;",
        )


class LocalNetworkServiceTests(SimpleTestCase):
    @patch.object(LocalNetworkService, "get_ipv4_address", return_value="192.168.0.11")
    def test_builds_frontend_url(self, mocked_address):
        self.assertEqual(
            LocalNetworkService().get_frontend_url(),
            "http://192.168.0.11:5173/",
        )

    @override_settings(WIFI_PASSWORD="network-secret", WIFI_ENCRYPTION="WPA2")
    def test_builds_network_addresses(self):
        with (
            patch.object(LocalNetworkService, "get_ipv4_address", return_value="192.168.0.20"),
            patch.object(LocalNetworkService, "get_current_wifi_name", return_value="AVACOM"),
        ):
            network_addresses = LocalNetworkService().get_network_addresses()

        self.assertEqual(
            network_addresses,
            {
                "ip_address": "192.168.0.20",
                "frontend_address": "http://192.168.0.20:5173/",
                "backend_address": "http://192.168.0.20:8000/",
                "query": "192.168.0.20:8000",
                "wifi": {
                    "ssid": "AVACOM",
                    "password": "network-secret",
                    "encryption": "WPA",
                    "qr_payload": "WIFI:T:WPA;S:AVACOM;P:network-secret;;",
                },
            },
        )

    def test_extracts_ssid_from_windows_network_information(self):
        network_output = """
            Name                   : Wi-Fi
            State                  : connected
            SSID                   : AVACOM Network
            BSSID                  : 00:00:00:00:00:00
        """
        with patch.object(LocalNetworkService, "_run_command", return_value=network_output):
            self.assertEqual(LocalNetworkService()._get_windows_ssid(), "AVACOM Network")


class NetworkAddressApiTests(APISimpleTestCase):
    @override_settings(WIFI_PASSWORD="network-secret", WIFI_ENCRYPTION="WPA")
    def test_returns_network_addresses(self):
        with (
            patch.object(LocalNetworkService, "get_ipv4_address", return_value="192.168.0.20"),
            patch.object(LocalNetworkService, "get_current_wifi_name", return_value="AVACOM"),
        ):
            response = self.client.get("/api/network/ip-address/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "data": {
                    "ip_address": "192.168.0.20",
                    "frontend_address": "http://192.168.0.20:5173/",
                    "backend_address": "http://192.168.0.20:8000/",
                    "query": "192.168.0.20:8000",
                    "wifi": {
                        "ssid": "AVACOM",
                        "password": "network-secret",
                        "encryption": "WPA",
                        "qr_payload": "WIFI:T:WPA;S:AVACOM;P:network-secret;;",
                    },
                }
            },
        )
