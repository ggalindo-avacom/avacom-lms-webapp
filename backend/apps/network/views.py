from rest_framework import status
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
