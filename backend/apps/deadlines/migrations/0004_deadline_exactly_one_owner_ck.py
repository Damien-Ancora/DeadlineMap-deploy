from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deadlines', '0003_initial'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='deadline',
            constraint=models.CheckConstraint(
                check=(
                    (models.Q(user__isnull=False) & models.Q(group__isnull=True))
                    | (models.Q(user__isnull=True) & models.Q(group__isnull=False))
                ),
                name='deadline_exactly_one_owner_ck',
            ),
        ),
    ]
