from django.db import models
from django.conf import settings


class Group(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'group'

    def __str__(self):
        return self.name


class GroupUser(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='group_memberships',
    )
    is_admin = models.BooleanField(default=False)

    class Meta:
        db_table = 'group_user'
        unique_together = ('group', 'user')

    def __str__(self):
        return f"{self.user} in {self.group} (admin={self.is_admin})"
