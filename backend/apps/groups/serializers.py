from rest_framework import serializers
from apps.users.models import User
from apps.users.serializers import UserSerializer
from .models import Group, GroupUser


class GroupSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(source='memberships.count', read_only=True)
    is_user_admin = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['id', 'name', 'members_count', 'is_user_admin']

    def get_is_user_admin(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            # Efficiently check if the user is an admin using prefetched related data
            for membership in obj.memberships.all():
                if membership.user_id == request.user.id:
                    return membership.is_admin
        return False


class GroupUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = GroupUser
        fields = ['id', 'group', 'user', 'user_id', 'is_admin']


class GroupDetailSerializer(serializers.ModelSerializer):
    members = GroupUserSerializer(source='memberships', many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'members']
