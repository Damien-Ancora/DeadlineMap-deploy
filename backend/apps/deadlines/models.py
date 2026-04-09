from django.db import models
from django.conf import settings


class Deadline(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    start_date = models.DateField()
    due_date = models.DateField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='deadlines',
    )
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='deadlines',
    )

    class Meta:
        db_table = 'deadline'
        constraints = [
            models.CheckConstraint(
                condition=(
                    (models.Q(user__isnull=False) & models.Q(group__isnull=True))
                    | (models.Q(user__isnull=True) & models.Q(group__isnull=False))
                ),
                name='deadline_exactly_one_owner_ck',
            ),
        ]

    def __str__(self):
        return f"{self.name} (due: {self.due_date})"