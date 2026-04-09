from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Deadline
from apps.groups.models import Group, GroupUser

User = get_user_model()

class DeadlineTests(APITestCase):
    def setUp(self):
        # Create user + group
        self.user = User.objects.create_user(username='test', email='test@test.com', password='pwd')
        self.group = Group.objects.create(name='Test Group')
        GroupUser.objects.create(group=self.group, user=self.user, is_admin=True)

        self.client.force_authenticate(user=self.user)

    def test_create_personal_deadline(self):
        """
        Create a deadline only for the user.
        """
        url = reverse('deadline-list')
        data = {
            'name': 'Personal Task',
            'description': 'My description',
            'start_date': '2030-01-01',
            'due_date': '2030-01-01',
            'status': 'pending',
            'is_personal': 'true'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Deadline.objects.filter(user=self.user).count(), 1)
        self.assertIsNone(Deadline.objects.get().group)

    def test_create_group_deadline(self):
        """
        Create a deadline for a group.
        """
        url = reverse('deadline-list')
        data = {
            'name': 'Group Task',
            'description': 'Group desc',
            'start_date': '2030-01-01',
            'due_date': '2030-01-01',
            'status': 'pending',
            'group': self.group.id
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        deadline = Deadline.objects.get()
        self.assertEqual(deadline.group, self.group)
        # Assuming group deadlines might not assign a user, need to check default behavior or allow None
        # If user is assigned to creator, fine.
        
    def test_list_deadlines(self):
        """
        List returns both personal + group deadlines.
        """
        # Create deadlines with start_date
        Deadline.objects.create(name="Personal", user=self.user, start_date='2030-01-01', due_date='2030-01-01')
        Deadline.objects.create(name="Group", group=self.group, start_date='2030-01-01', due_date='2030-01-01')
        
        url = reverse('deadline-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
    def test_update_status(self):
        """
        Update status via PATCH.
        """
        d = Deadline.objects.create(name="Task", user=self.user, start_date='2030-01-01', due_date='2030-01-01', status='pending')
        
        url = reverse('deadline-detail', kwargs={'pk': d.id})
        data = {'status': 'completed'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        d.refresh_from_db()
        self.assertEqual(d.status, 'completed')

    def test_filter_deadlines(self):
        """
        Test filters: status/group.
        """
        # Create deadlines with start_date
        d1 = Deadline.objects.create(name="Completed Task", user=self.user, 
                                     status='completed', start_date='2030-01-01', due_date='2030-01-01')
        d2 = Deadline.objects.create(name="Pending Task", user=self.user, 
                                     status='pending', start_date='2030-01-01', due_date='2030-01-01')
        d3 = Deadline.objects.create(name="Group Task", group=self.group, 
                                     status='pending', start_date='2030-01-01', due_date='2030-01-01')
        
        # Filter by Status
        url = reverse('deadline-list') + '?status=completed'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], d1.id)

        # Filter by Group
        url = reverse('deadline-list') + f'?group={self.group.id}'
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], d3.id)


    def test_create_mixed_deadline(self):
        """
        With current ownership rules, a deadline has a single owner.
        If both is_personal and group are sent, explicit group ownership is used.
        """
        url = reverse('deadline-list')
        data = {
            'name': 'Mixed Task',
            'description': 'Both personal and group',
            'start_date': '2030-01-01',
            'due_date': '2030-01-01',
            'status': 'pending',
            'is_personal': 'true',
            'group': self.group.id
        }
        res = self.client.post(url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(res.data, dict)
        self.assertEqual(Deadline.objects.count(), 1)
        self.assertEqual(Deadline.objects.filter(group=self.group).count(), 1)

    def test_create_deadline_permission_denied(self):
        """
        User cannot create deadline for group they are not in.
        """
        other_group = Group.objects.create(name="Other Group")
        # User is NOT in other_group
        
        url = reverse('deadline-list')
        data = {
            'name': 'Hacking Task',
            'start_date': '2030-01-01',
            'due_date': '2030-01-01',
            'group': other_group.id
        }
        res = self.client.post(url, data, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('group', res.data)

    def test_create_deadline_invalid_date_range(self):
        """
        start_date must be <= due_date.
        """
        url = reverse('deadline-list')
        data = {
            'name': 'Invalid Dates',
            'description': 'date mismatch',
            'start_date': '2030-02-10',
            'due_date': '2030-02-01',
            'status': 'pending',
            'is_personal': 'true',
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('due_date', response.data)

