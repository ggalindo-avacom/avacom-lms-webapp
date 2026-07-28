from django.db.models import QuerySet

from apps.network.models import WifiNetwork


class WifiNetworkConfigurationService:
    @staticmethod
    def list_networks() -> QuerySet[WifiNetwork]:
        return WifiNetwork.objects.all()

    @staticmethod
    def create_network(**validated_data: str) -> WifiNetwork:
        return WifiNetwork.objects.create(**validated_data)
