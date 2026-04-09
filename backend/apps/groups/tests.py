from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Group

User = get_user_model()

class GroupTests(APITestCase):
    def setUp(self):
        # Create users
        self.user_a = User.objects.create_user(username='alice', email='alice@test.com', password='password123')
        self.user_b = User.objects.create_user(username='bob', email='bob@test.com', password='password123')
        
        # Authenticate User A
        self.client.force_authenticate(user=self.user_a)

    def test_create_group(self):
        """
        Ensure a user can create a group and becomes admin.
        """
        url = reverse('group-list')
        data = {'name': 'Marketing Project'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Group.objects.count(), 1)
        self.assertEqual(Group.objects.get().memberships.first().user, self.user_a)
        self.assertTrue(Group.objects.get().memberships.first().is_admin)

    def test_list_groups(self):
        """
        Ensure user sees only their groups.
        """
        # Group for A
        g1 = Group.objects.create(name="A Group")
        g1.memberships.create(user=self.user_a, is_admin=True)
        
        # Group for B
        g2 = Group.objects.create(name="B Group")
        g2.memberships.create(user=self.user_b, is_admin=True)
        
        url = reverse('group-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], "A Group")

    def test_add_member(self):
        """
        Ensure group admin can add members.
        """
        # Create group
        g = Group.objects.create(name="Team A")
        g.memberships.create(user=self.user_a, is_admin=True)
        
        url = reverse('group-add-member', kwargs={'pk': g.id})
        
        data = {'email': 'bob@test.com'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check membership exists directly
        self.assertTrue(g.memberships.filter(user__username='bob').exists())

    def test_add_member_permission_denied(self):
        """
        Ensure non-admin cannot add members.
        """
        # User B creates group (so B is admin)
        g = Group.objects.create(name="B Group")
        g.memberships.create(user=self.user_b, is_admin=True)
        
        # Add User A as a REGULAR member
        g.memberships.create(user=self.user_a, is_admin=False)
        
        # User A tries to add another user
        self.client.force_authenticate(user=self.user_a) 
        
        url = reverse('group-add-member', kwargs={'pk': g.id})
        data = {'email': 'bob@test.com'} 
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_group_member(self):
        """
        Member leaves group -> membership removed, group stays.
        """
        g = Group.objects.create(name="Team A")
        # User A is admin (creator)
        g.memberships.create(user=self.user_a, is_admin=True)
        # User B is member
        g.memberships.create(user=self.user_b, is_admin=False)
        
        self.client.force_authenticate(user=self.user_b)
        url = reverse('group-leave', kwargs={'pk': g.id})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(g.memberships.filter(user=self.user_b).exists())
        self.assertTrue(Group.objects.filter(pk=g.id).exists()) # Group still exists

    def test_leave_group_admin(self):
        """
        Admin leaves group -> group dissolved.
        """
        g = Group.objects.create(name="StartUp")
        g.memberships.create(user=self.user_a, is_admin=True)
        
        self.client.force_authenticate(user=self.user_a)
        url = reverse('group-leave', kwargs={'pk': g.id})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Group.objects.filter(pk=g.id).exists())

    def test_remove_member(self):
        """
        Admin removes a member.
        """
        # Create group & members
        g = Group.objects.create(name="Team X")
        g.memberships.create(user=self.user_a, is_admin=True)
        g.memberships.create(user=self.user_b, is_admin=False)
        
        url = reverse('group-remove-member', kwargs={'pk': g.id})
        data = {'user_id': self.user_b.id}
        
        self.client.force_authenticate(user=self.user_a)
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(g.memberships.filter(user=self.user_b).exists())

    def test_add_non_existent_member(self):
        """
        Try to add a user who does not exist.
        """
        g = Group.objects.create(name="Team Y")
        g.memberships.create(user=self.user_a, is_admin=True)
        
        url = reverse('group-add-member', kwargs={'pk': g.id})
        data = {'email': 'imganinary@test.com'}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


