from typing import Any

from django.db import transaction

from login.models import CustomUser


class CreateUserService:
    @transaction.atomic
    def execute(self, **validated_data: Any) -> CustomUser:
        return CustomUser.objects.create_user(**validated_data)
