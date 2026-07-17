from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.network.services import LocalNetworkService


class NetworkAddressView(APIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    service_class = LocalNetworkService

    def get(self, request) -> Response:
        network_addresses = self.service_class().get_network_addresses()
        return Response({"data": network_addresses})
