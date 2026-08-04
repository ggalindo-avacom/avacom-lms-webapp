from django.urls import path

from apps.network.views import (
    NetworkAddressView,
    WifiNetworkDetailView,
    WifiNetworkListCreateView,
)


urlpatterns = [
    path("ip-address/", NetworkAddressView.as_view(), name="network-ip-address"),
    path(
        "wifi-networks/",
        WifiNetworkListCreateView.as_view(),
        name="wifi-network-list-create",
    ),
    path(
        "wifi-networks/<int:network_id>/",
        WifiNetworkDetailView.as_view(),
        name="wifi-network-detail",
    ),
]
