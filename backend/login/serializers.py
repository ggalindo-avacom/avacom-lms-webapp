from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from login.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "full_name", "email", "type_user")
        read_only_fields = ("id",)


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password], style={"input_type": "password"})

    class Meta:
        model = CustomUser
        fields = ("id", "full_name", "email", "password", "type_user")
        read_only_fields = ("id",)
