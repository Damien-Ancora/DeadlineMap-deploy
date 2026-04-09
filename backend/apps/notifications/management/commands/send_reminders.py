from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.deadlines.models import Deadline
from apps.notifications.models import Notification, NotificationUser
from apps.groups.models import GroupUser

class Command(BaseCommand):
    help = "Send reminders for deadlines due in 3 days."

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        reminder_date = today + timedelta(days=3)
        
        # Find deadlines due in exactly 3 days and not completed.
        deadlines = Deadline.objects.select_related('group', 'user').filter(due_date=reminder_date).exclude(status='completed')

        notification_users_to_create = []
        
        count = 0
        for deadline in deadlines:
            title = f"Rappel : {deadline.name}"
            description = f"La deadline '{deadline.name}' arrive à échéance dans 3 jours ({deadline.due_date})."

            # Reuse same-day reminder notification if command runs multiple times.
            notification = Notification.objects.filter(
                title=title,
                description=description,
                date__date=today,
            ).first()
            if notification is None:
                notification = Notification.objects.create(title=title, description=description)
            
            recipients = []
            if deadline.group:
                # All group members
                members = GroupUser.objects.filter(group=deadline.group).select_related('user')
                recipients = [m.user for m in members]
            elif deadline.user:
                # Personal deadline
                recipients = [deadline.user]
            
            for user in recipients:
                notification_users_to_create.append(
                    NotificationUser(notification=notification, user=user)
                )
                count += 1
        
        # Bulk create all links
        NotificationUser.objects.bulk_create(notification_users_to_create, ignore_conflicts=True)
                
        self.stdout.write(self.style.SUCCESS(f"Envoyé {count} rappels pour {deadlines.count()} deadlines."))
