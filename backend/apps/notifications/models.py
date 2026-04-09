from django.db import models
from django.conf import settings


class Notification(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notification'

    def __str__(self):
        return self.title


class NotificationUser(models.Model):
    notification = models.ForeignKey(
        Notification, on_delete=models.CASCADE, related_name='recipients'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_links',
    )
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = 'notification_user'
        unique_together = ('notification', 'user')

    def __str__(self):
        return f"{self.notification} → {self.user} (read={self.is_read})"
