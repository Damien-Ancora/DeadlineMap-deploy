from rest_framework import serializers
from .models import Deadline


class DeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deadline
        fields = [
            'id', 'name', 'priority', 'description',
            'status', 'start_date', 'due_date', 'user', 'group',
        ]

    def validate(self, data):
        group = data.get('group', getattr(self.instance, 'group', None))
        user = data.get('user', getattr(self.instance, 'user', None))
        start_date = data.get('start_date', getattr(self.instance, 'start_date', None))
        due_date = data.get('due_date', getattr(self.instance, 'due_date', None))
        request = self.context.get('request')

        if start_date and due_date and start_date > due_date:
            raise serializers.ValidationError({
                'due_date': "La date d'échéance doit être postérieure ou égale à la date de début."
            })

        # Ownership invariant: a deadline must be personal OR group-owned.
        if group is None and user is None:
            raise serializers.ValidationError({
                "detail": "Une deadline doit être personnelle (user) ou de groupe (group)."
            })

        if group is not None and user is not None:
            raise serializers.ValidationError({
                "detail": "Une deadline ne peut pas être à la fois personnelle et de groupe."
            })
        
        # Validation : Un utilisateur ne peut créer une deadline que s'il est membre du groupe
        if group and request and request.user.is_authenticated:
            from apps.groups.models import GroupUser
            if not GroupUser.objects.filter(group=group, user=request.user).exists():
                raise serializers.ValidationError({
                    "group": "Vous devez être membre du groupe pour y créer ou modifier une deadline."
                })
        return data
