from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Notification, NotificationUser
from apps.groups.models import Group, GroupUser
from apps.deadlines.models import Deadline

User = get_user_model()

class NotificationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test', email='test@test.com', password='pwd')
        self.client.force_authenticate(user=self.user)
        
        # Create a notification for the user
        self.notif = Notification.objects.create(title="Test", description="Desc")
        self.notif_user = NotificationUser.objects.create(notification=self.notif, user=self.user, is_read=False)

    def test_notification_on_add_member(self):
        """
        A regular member receives a notification when added to a group.
        """
        # Another user adds this user to a group
        admin = User.objects.create_user(username='admin', email='admin@test.com', password='pwd')
        g = Group.objects.create(name="Signal Group")
        GroupUser.objects.create(group=g, user=admin, is_admin=True)
        
        # Add 'test' user to group
        GroupUser.objects.create(group=g, user=self.user, is_admin=False)
        
        notifs = NotificationUser.objects.filter(user=self.user)
        self.assertEqual(notifs.count(), 2)
        latest = notifs.order_by('-id').first()
        self.assertIn("Ajout au groupe", latest.notification.title)
        self.assertIn("Signal Group", latest.notification.description)

    def test_notification_on_group_deadline_create_excludes_actor(self):
        """
        Group deadline creation notifies members/admins except the actor.
        """
        g = Group.objects.create(name="Deadline Group")
        creator = self.user
        member = User.objects.create_user(username='member', email='member@test.com', password='pwd')
        GroupUser.objects.create(group=g, user=creator, is_admin=True)
        GroupUser.objects.create(group=g, user=member, is_admin=False)

        url = reverse('deadline-list')
        payload = {
            'name': 'New Task',
            'description': 'Desc',
            'start_date': '2030-01-01',
            'due_date': '2030-01-01',
            'status': 'pending',
            'group': g.id,
            'user': None,
            'is_personal': False,
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        creator_count = NotificationUser.objects.filter(user=creator).count()
        member_count = NotificationUser.objects.filter(user=member).count()
        self.assertEqual(creator_count, 1)  # only base notif from setUp
        self.assertEqual(member_count, 2)   # add-to-group signal + deadline-created notif

        member_latest = NotificationUser.objects.filter(user=member).order_by('-id').first()
        self.assertIn("Nouvelle deadline", member_latest.notification.title)
        self.assertIn("a créé la deadline", member_latest.notification.description)

    def test_notification_on_group_deadline_delete_excludes_actor(self):
        """
        Group deadline deletion notifies members/admins except the actor.
        """
        g = Group.objects.create(name="Delete Group")
        creator = self.user
        member = User.objects.create_user(username='member2', email='member2@test.com', password='pwd')
        GroupUser.objects.create(group=g, user=creator, is_admin=True)
        GroupUser.objects.create(group=g, user=member, is_admin=False)

        deadline = Deadline.objects.create(
            name='Task To Delete',
            group=g,
            priority='high',
            status='pending',
            start_date='2030-01-01',
            due_date='2030-01-01'
        )

        url = reverse('deadline-detail', kwargs={'pk': deadline.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        creator_latest = NotificationUser.objects.filter(user=creator).order_by('-id').first()
        member_latest = NotificationUser.objects.filter(user=member).order_by('-id').first()

        # Actor should not receive deletion notification.
        self.assertNotIn("Deadline supprimée", creator_latest.notification.title)
        # Other member receives it.
        self.assertIn("Deadline supprimée", member_latest.notification.title)
        self.assertIn("a supprimé la deadline", member_latest.notification.description)


    def test_list_notifications(self):
        """
        User sees their notifications.
        """
        url = reverse('notification-user-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['notification']['title'], "Test")
        self.assertFalse(response.data['results'][0]['is_read'])

    def test_mark_as_read(self):
        """
        Mark single notification as read.
        """
        url = reverse('notification-user-mark-read', kwargs={'pk': self.notif_user.id})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.notif_user.refresh_from_db()
        self.assertTrue(self.notif_user.is_read)

    def test_mark_all_read(self):
        """
        Mark all as read.
        """
        # Create another unread
        n2 = Notification.objects.create(title="Test2", description="Desc2")
        NotificationUser.objects.create(notification=n2, user=self.user, is_read=False)

        url = reverse('notification-user-mark-all-read')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(NotificationUser.objects.filter(user=self.user, is_read=False).exists())

    def test_delete_notification(self):
        """
        Delete single notification.
        """
        url = reverse('notification-user-detail', kwargs={'pk': self.notif_user.id})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(NotificationUser.objects.filter(id=self.notif_user.id).exists())

    def test_delete_all(self):
        """
        Delete all notifications.
        """
        url = reverse('notification-user-delete-all')
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(NotificationUser.objects.filter(user=self.user).count(), 0)
