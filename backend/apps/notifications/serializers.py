from rest_framework import serializers
from .models import Notification, NotificationUser


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'description', 'date']


class NotificationUserSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model = NotificationUser
        fields = ['id', 'notification', 'user', 'is_read']
        read_only_fields = ['user']
