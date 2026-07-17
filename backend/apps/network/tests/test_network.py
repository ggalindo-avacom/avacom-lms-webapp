from unittest.mock import patch

from django.test import SimpleTestCase
from rest_framework.test import APISimpleTestCase

from apps.network.services import LocalNetworkService


class LocalNetworkServiceTests(SimpleTestCase):
    @patch.object(LocalNetworkService, "get_ipv4_address", return_value="192.168.0.11")
    def test_builds_frontend_url(self, mocked_address):
        self.assertEqual(
            LocalNetworkService().get_frontend_url(),
            "http://192.168.0.11:5173/",
        )

    @patch.object(LocalNetworkService, "get_ipv4_address", return_value="192.168.0.20")
    def test_builds_network_addresses(self, mocked_address):
        self.assertEqual(
            LocalNetworkService().get_network_addresses(),
            {
                "ip_address": "192.168.0.20",
                "frontend_address": "http://192.168.0.20:5173/",
                "backend_address": "http://192.168.0.20:8000/",
                "query": "192.168.0.20:8000",
            },
        )


class NetworkAddressApiTests(APISimpleTestCase):
    @patch.object(LocalNetworkService, "get_ipv4_address", return_value="192.168.0.20")
    def test_returns_network_addresses(self, mocked_address):
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
                }
            },
        )
