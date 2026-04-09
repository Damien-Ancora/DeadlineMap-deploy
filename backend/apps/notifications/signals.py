from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.groups.models import GroupUser
from apps.notifications.models import Notification, NotificationUser

@receiver(post_save, sender=GroupUser)
def notify_member_added_to_group(sender, instance, created, **kwargs):
    """
    Notify only regular members when they are added to a group.
    Group creator (admin membership) should not receive this notification.
    """
    if not created or instance.is_admin:
        return

    notification = Notification.objects.create(
        title=f"Ajout au groupe : {instance.group.name}",
        description=f"Vous avez été ajouté au groupe '{instance.group.name}'.",
    )
    NotificationUser.objects.create(notification=notification, user=instance.user)
