from django.db import models


class WifiNetwork(models.Model):
    class EncryptionType(models.TextChoices):
        WPA = "WPA", "WPA"
        WEP = "WEP", "WEP"
        NO_PASSWORD = "nopass", "No password"

    name = models.CharField(max_length=255, unique=True)
    wifipassword = models.CharField(max_length=255, blank=True)
    type = models.CharField(
        max_length=10,
        choices=EncryptionType.choices,
        default=EncryptionType.WPA,
    )

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name
