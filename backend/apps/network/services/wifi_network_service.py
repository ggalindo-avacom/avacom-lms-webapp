from django.db.models import QuerySet

from apps.network.models import WifiNetwork


class WifiNetworkConfigurationService:
    @staticmethod
    def list_networks() -> QuerySet[WifiNetwork]:
        return WifiNetwork.objects.all()

    @staticmethod
    def create_network(**validated_data: str) -> WifiNetwork:
        return WifiNetwork.objects.create(**validated_data)

    @staticmethod
    def get_network(network_id: int) -> WifiNetwork | None:
        return WifiNetwork.objects.filter(pk=network_id).first()

    @staticmethod
    def update_network(
        wifi_network: WifiNetwork, **validated_data: str
    ) -> WifiNetwork:
        for field, value in validated_data.items():
            setattr(wifi_network, field, value)

        wifi_network.save()
        return wifi_network

    @staticmethod
    def delete_network(wifi_network: WifiNetwork) -> None:
        wifi_network.delete()
