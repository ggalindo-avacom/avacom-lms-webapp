from unittest.mock import patch

from django.test import SimpleTestCase, TestCase
from rest_framework.test import APITestCase

from apps.network.models import WifiNetwork
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


class LocalNetworkServiceTests(TestCase):
    @patch.object(
        LocalNetworkService,
        "get_ipv4_address",
        return_value="192.168.0.11",
    )
    def test_builds_frontend_url(self, mocked_address):
        self.assertEqual(
            LocalNetworkService().get_frontend_url(),
            "http://192.168.0.11:5173/",
        )

    def test_builds_network_addresses_from_matching_database_network(self):
        WifiNetwork.objects.create(
            name="AVACOM",
            wifipassword="network-secret",
            type=WifiNetwork.EncryptionType.WPA,
        )

        with (
            patch.object(
                LocalNetworkService,
                "get_ipv4_address",
                return_value="192.168.0.20",
            ),
            patch.object(
                LocalNetworkService,
                "get_current_wifi_name",
                return_value="AVACOM",
            ),
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

    def test_returns_detected_ssid_without_credentials_when_not_configured(self):
        with patch.object(
            LocalNetworkService,
            "get_current_wifi_name",
            return_value="Unknown network",
        ):
            wifi_information = LocalNetworkService().get_wifi_information()

        self.assertEqual(
            wifi_information,
            {
                "ssid": "Unknown network",
                "password": None,
                "encryption": None,
                "qr_payload": None,
            },
        )

    def test_builds_open_network_payload_with_empty_password(self):
        WifiNetwork.objects.create(
            name="AVACOM Open",
            wifipassword="",
            type=WifiNetwork.EncryptionType.NO_PASSWORD,
        )

        with patch.object(
            LocalNetworkService,
            "get_current_wifi_name",
            return_value="AVACOM Open",
        ):
            wifi_information = LocalNetworkService().get_wifi_information()

        self.assertEqual(
            wifi_information["qr_payload"],
            "WIFI:T:nopass;S:AVACOM Open;P:;;",
        )

    def test_extracts_ssid_from_windows_network_information(self):
        network_output = """
            Name                   : Wi-Fi
            State                  : connected
            SSID                   : AVACOM Network
            BSSID                  : 00:00:00:00:00:00
        """
        with patch.object(
            LocalNetworkService,
            "_run_command",
            return_value=network_output,
        ):
            self.assertEqual(
                LocalNetworkService()._get_windows_ssid(),
                "AVACOM Network",
            )


class NetworkAddressApiTests(APITestCase):
    def test_returns_network_addresses_using_database_configuration(self):
        WifiNetwork.objects.create(
            name="AVACOM",
            wifipassword="network-secret",
            type=WifiNetwork.EncryptionType.WPA,
        )

        with (
            patch.object(
                LocalNetworkService,
                "get_ipv4_address",
                return_value="192.168.0.20",
            ),
            patch.object(
                LocalNetworkService,
                "get_current_wifi_name",
                return_value="AVACOM",
            ),
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


class WifiNetworkApiTests(APITestCase):
    def test_creates_network_without_authentication(self):
        response = self.client.post(
            "/api/network/wifi-networks/",
            {
                "name": "Makers",
                "wifipassword": "",
                "type": "nopass",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(WifiNetwork.objects.filter(name="Makers").exists())

    def test_creates_network_and_normalizes_encryption(self):
        response = self.client.post(
            "/api/network/wifi-networks/",
            {
                "name": "Makers",
                "wifipassword": "Dc3k42vjry6*",
                "type": "WPA2",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            response.json()["data"],
            {
                "id": response.json()["data"]["id"],
                "name": "Makers",
                "wifipassword": "Dc3k42vjry6*",
                "type": "WPA",
            },
        )
        self.assertTrue(
            WifiNetwork.objects.filter(name="Makers", type="WPA").exists()
        )

    def test_lists_registered_networks(self):
        WifiNetwork.objects.create(
            name="Makers",
            wifipassword="",
            type=WifiNetwork.EncryptionType.NO_PASSWORD,
        )
        WifiNetwork.objects.create(
            name="AVACOM",
            wifipassword="secret",
            type=WifiNetwork.EncryptionType.WPA,
        )

        response = self.client.get("/api/network/wifi-networks/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["meta"]["count"], 2)
        self.assertEqual(
            [network["name"] for network in response.json()["data"]],
            ["AVACOM", "Makers"],
        )

    def test_updates_network_password(self):
        wifi_network = WifiNetwork.objects.create(
            name="Makers",
            wifipassword="old-password",
            type=WifiNetwork.EncryptionType.WPA,
        )

        response = self.client.patch(
            f"/api/network/wifi-networks/{wifi_network.pk}/",
            {"wifipassword": "new-password"},
            format="json",
        )

        wifi_network.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["wifipassword"], "new-password")
        self.assertEqual(wifi_network.wifipassword, "new-password")
        self.assertEqual(wifi_network.name, "Makers")

    def test_updates_network_type_and_normalizes_encryption(self):
        wifi_network = WifiNetwork.objects.create(
            name="Makers",
            wifipassword="",
            type=WifiNetwork.EncryptionType.NO_PASSWORD,
        )

        response = self.client.patch(
            f"/api/network/wifi-networks/{wifi_network.pk}/",
            {"type": "WPA3", "wifipassword": "Dc3k42vjry6*"},
            format="json",
        )

        wifi_network.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(wifi_network.type, "WPA")
        self.assertEqual(wifi_network.wifipassword, "Dc3k42vjry6*")

    def test_returns_not_found_when_updating_missing_network(self):
        response = self.client.patch(
            "/api/network/wifi-networks/9999/",
            {"wifipassword": "irrelevant"},
            format="json",
        )

        self.assertEqual(response.status_code, 404)

    def test_deletes_network(self):
        wifi_network = WifiNetwork.objects.create(
            name="Makers",
            wifipassword="secret",
            type=WifiNetwork.EncryptionType.WPA,
        )

        response = self.client.delete(
            f"/api/network/wifi-networks/{wifi_network.pk}/"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(
            WifiNetwork.objects.filter(pk=wifi_network.pk).exists()
        )

    def test_returns_not_found_when_deleting_missing_network(self):
        response = self.client.delete("/api/network/wifi-networks/9999/")

        self.assertEqual(response.status_code, 404)
