from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(APITestCase):
    def test_register_user(self):
        """
        Ensure we can create a new user object.
        """
        try:
            url = reverse('auth-register')
        except:
            # Fallback if name is different, trying direct path or list
            url = '/api/auth/register/'
            
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'StrongPassword123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_login_user(self):
        """
        Ensure we can login and get a token.
        """
        # Create user first
        user = User.objects.create_user(username='testuser', password='StrongPassword123!')
        
        try:
            url = reverse('auth-login')
        except:
            url = '/api/auth/login/'
            
        data = {
            'username': 'testuser',
            'password': 'StrongPassword123!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_invalid_credentials(self):
        """
        Ensure login fails with wrong password.
        """
        url = reverse('auth-login') # Correct view name
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        # Create user first
        User.objects.create_user(username='testuser', email='test@test.com', password='password123')
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_register_duplicate_email(self):
        """
        Ensure we cannot register with an existing email.
        """
        User.objects.create_user(username='exists', email='test@test.com', password='pwd')
        
        url = reverse('auth-register')  # Correct view name
        data = {'email': 'test@test.com', 'password': 'newpassword', 'first_name': 'Test', 'last_name': 'User'}
        response = self.client.post(url, data, format='json')
        
        # Depending on serializer validation, this is usually 400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_cannot_set_role(self):
        """
        Public registration cannot escalate role; backend keeps default role.
        """
        url = reverse('auth-register')
        data = {
            'username': 'eviluser',
            'email': 'evil@example.com',
            'password': 'StrongPassword123!',
            'first_name': 'Evil',
            'last_name': 'User',
            'role': 'admin',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        created = User.objects.get(username='eviluser')
        self.assertEqual(created.role, 'student')


