from django.urls import path

from apps.network.views import NetworkAddressView


urlpatterns = [
    path("ip-address/", NetworkAddressView.as_view(), name="network-ip-address"),
]
