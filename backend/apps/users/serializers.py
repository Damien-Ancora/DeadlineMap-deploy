from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'role']


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'role']
        extra_kwargs = {'username': {'required': False}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        # If username is not provided, use email as username
        if 'username' not in validated_data:
            validated_data['username'] = validated_data.get('email')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

    def update(self, instance, validated_data):
        email = validated_data.get('email', instance.email)
        if email != instance.email:
            # We must update the username to match the new email, 
            # otherwise logging in will break or become inconsistent.
            instance.username = email
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
