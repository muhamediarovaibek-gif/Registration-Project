from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserTests(APITestCase):

    def test_register(self):
        response = self.client.post('/api/register/', {
            "username": "testuser",
            "email": "test@test.com",
            "password": "123456"
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login(self):
        User.objects.create_user(
            username="a",
            email="a@a.com",
            password="123"
        )

        response = self.client.post('/api/token/', {
            "username": "a",
            "password": "123"
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)