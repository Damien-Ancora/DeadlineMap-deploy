from rest_framework import permissions
from .models import GroupUser

class IsGroupAdminOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour n'autoriser que les administrateurs du groupe
    à le modifier ou le supprimer. Les membres peuvent le consulter.
    """
    def has_object_permission(self, request, view, obj):
        # Lecture seule
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Le request.user est-il admin du groupe ?
        return GroupUser.objects.filter(group=obj, user=request.user, is_admin=True).exists()
