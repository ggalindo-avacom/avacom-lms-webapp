from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APITestCase


class CustomUserTests(TestCase):
    def test_manager_hashes_password(self):
        user = get_user_model().objects.create_user(
            email="student@example.com",
            password="StrongPassword-2026!",
            full_name="Student Example",
            type_user="student",
        )
        self.assertNotEqual(user.password, "StrongPassword-2026!")
        self.assertTrue(user.check_password("StrongPassword-2026!"))


class AuthenticationApiTests(APITestCase):
    def test_register_and_obtain_jwt(self):
        registration = self.client.post(
            "/api/auth/register/",
            {
                "full_name": "Teacher Example",
                "email": "teacher@example.com",
                "password": "StrongPassword-2026!",
                "type_user": "teacher",
            },
            format="json",
        )
        self.assertEqual(registration.status_code, 201)
        self.assertNotIn("password", registration.data)

        token = self.client.post(
            "/api/auth/token/",
            {"email": "teacher@example.com", "password": "StrongPassword-2026!"},
            format="json",
        )
        self.assertEqual(token.status_code, 200)
        self.assertIn("access", token.data)
        self.assertIn("refresh", token.data)

    def test_rejects_invalid_user_type(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "full_name": "Invalid Role",
                "email": "invalid@example.com",
                "password": "StrongPassword-2026!",
                "type_user": "owner",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
