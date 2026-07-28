from rest_framework import serializers

from apps.network.models import WifiNetwork
from apps.network.services.genqr import normalize_encryption


class WifiNetworkSerializer(serializers.ModelSerializer):
    type = serializers.CharField()
    wifipassword = serializers.CharField(
        allow_blank=True,
        max_length=255,
        required=False,
        trim_whitespace=False,
    )

    class Meta:
        model = WifiNetwork
        fields = ("id", "name", "wifipassword", "type")
        read_only_fields = ("id",)

    def validate_name(self, value: str) -> str:
        network_name = value.strip()
        if not network_name:
            raise serializers.ValidationError("The Wi-Fi network name is required.")
        return network_name

    def validate_type(self, value: str) -> str:
        try:
            return normalize_encryption(value)
        except ValueError as error:
            raise serializers.ValidationError(str(error)) from error
