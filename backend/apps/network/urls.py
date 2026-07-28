from django.urls import path

from apps.network.views import NetworkAddressView, WifiNetworkListCreateView


urlpatterns = [
    path("ip-address/", NetworkAddressView.as_view(), name="network-ip-address"),
    path(
        "wifi-networks/",
        WifiNetworkListCreateView.as_view(),
        name="wifi-network-list-create",
    ),
]
