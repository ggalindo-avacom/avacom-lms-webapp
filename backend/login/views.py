from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from login.serializers import CustomUserSerializer, RegisterUserSerializer
from login.services import CreateUserService


class RegisterUserView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = CreateUserService().execute(**serializer.validated_data)
        return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)
