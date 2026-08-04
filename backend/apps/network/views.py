from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.network.serializers import WifiNetworkSerializer
from apps.network.services import (
    LocalNetworkService,
    WifiNetworkConfigurationService,
)


class NetworkAddressView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    service_class = LocalNetworkService

    def get(self, request) -> Response:
        network_addresses = self.service_class().get_network_addresses()
        return Response({"data": network_addresses})


class WifiNetworkListCreateView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    service_class = WifiNetworkConfigurationService

    def get(self, request) -> Response:
        wifi_networks = self.service_class().list_networks()
        serializer = WifiNetworkSerializer(wifi_networks, many=True)
        return Response(
            {
                "data": serializer.data,
                "meta": {"count": len(serializer.data)},
            }
        )

    def post(self, request) -> Response:
        serializer = WifiNetworkSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        wifi_network = self.service_class().create_network(
            **serializer.validated_data
        )
        return Response(
            {"data": WifiNetworkSerializer(wifi_network).data},
            status=status.HTTP_201_CREATED,
        )


class WifiNetworkDetailView(APIView):
    """Update y Delete de una red guardada: /network/wifi-networks/<id>/."""

    authentication_classes = ()
    permission_classes = (AllowAny,)
    service_class = WifiNetworkConfigurationService

    def _get_network(self, network_id: int):
        wifi_network = self.service_class().get_network(network_id)
        if wifi_network is None:
            raise NotFound("The Wi-Fi network does not exist.")
        return wifi_network

    def patch(self, request, network_id: int) -> Response:
        wifi_network = self._get_network(network_id)
        serializer = WifiNetworkSerializer(
            wifi_network, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        updated_network = self.service_class().update_network(
            wifi_network, **serializer.validated_data
        )
        return Response({"data": WifiNetworkSerializer(updated_network).data})

    def delete(self, request, network_id: int) -> Response:
        wifi_network = self._get_network(network_id)
        self.service_class().delete_network(wifi_network)
        return Response(status=status.HTTP_204_NO_CONTENT)
