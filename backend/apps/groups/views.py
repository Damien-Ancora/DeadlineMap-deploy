from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Group, GroupUser
from .serializers import GroupSerializer, GroupUserSerializer, GroupDetailSerializer
from .permissions import IsGroupAdminOrReadOnly


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsGroupAdminOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return GroupDetailSerializer
        return GroupSerializer

    def get_queryset(self):
        # We optimize the queryset by prefetching memberships and related users
        qs = Group.objects.prefetch_related('memberships', 'memberships__user')
        # Users only see groups they belong to
        user = self.request.user
        if user.is_staff:  # Admins see all
            return qs.all().order_by('id')
        return qs.filter(memberships__user=user).distinct().order_by('id')

    def perform_create(self, serializer):
        # The creator becomes the group admin
        group = serializer.save()
        GroupUser.objects.create(group=group, user=self.request.user, is_admin=True)

    # perform_update and perform_destroy no longer need inline permissions,
    # because IsGroupAdminOrReadOnly handles object-level write access!

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """POST /api/groups/{id}/add_member/ — add a user by email."""
        group = self.get_object() # Permissions are automatically checked here
        email = request.data.get('email')
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            new_member = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Utilisateur non trouvé.'}, status=status.HTTP_404_NOT_FOUND)

        if GroupUser.objects.filter(group=group, user=new_member).exists():
             return Response({'detail': 'L\'utilisateur est déjà dans le groupe.'}, status=status.HTTP_400_BAD_REQUEST)

        GroupUser.objects.create(group=group, user=new_member, is_admin=False)
        return Response({'detail': 'Membre ajouté.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """POST /api/groups/{id}/remove_member/ — remove a user by ID."""
        group = self.get_object() # Permissions are automatically checked here
        user_id = request.data.get('user_id')
        try:
            membership = GroupUser.objects.get(group=group, user_id=user_id)
            # Prevent removing yourself (use leave instead)
            if membership.user == request.user:
                 return Response({'detail': 'Utilisez le point de terminaison leave pour quitter le groupe.'}, status=status.HTTP_400_BAD_REQUEST)
            membership.delete()
        except GroupUser.DoesNotExist:
            return Response({'detail': 'Membre non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'detail': 'Membre supprimé.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        """POST /api/groups/{id}/leave/ — authenticated user leaves the group."""
        group = self.get_object()
        user = request.user
        
        try:
            membership = GroupUser.objects.get(group=group, user=user)
        except GroupUser.DoesNotExist:
            return Response({'detail': 'not_a_member'}, status=status.HTTP_400_BAD_REQUEST)

        # Logic: If admin leaves, dissolve the group? 
        # Requirement: "dissoudre le groupe si il le quitte(si il est l'admin)"
        if membership.is_admin:
            group.delete() # This deletes the group and cascades to all memberships and deadlines
            return Response({'detail': 'Le groupe est dissous parce que l\'admin a quitté.'}, status=status.HTTP_200_OK)

        # If a member leaves, remove their personal deadlines within that group
        # Requirement: "Quand on est membre on peut quitter le groupe, cela supprime également les deadlines associés au groupes."
        from apps.deadlines.models import Deadline
        Deadline.objects.filter(group=group, user=user).delete()

        membership.delete()
        return Response({'detail': 'left'}, status=status.HTTP_200_OK)



class GroupUserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Users can only read memberships of groups they belong to.
        user = self.request.user
        if user.is_staff:
            return GroupUser.objects.select_related('group', 'user').all()
        return GroupUser.objects.select_related('group', 'user').filter(group__memberships__user=user).distinct()
