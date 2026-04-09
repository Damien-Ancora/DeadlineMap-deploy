from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from .models import Deadline
from .serializers import DeadlineSerializer
from apps.groups.models import GroupUser
from apps.notifications.models import Notification, NotificationUser


class DeadlineViewSet(viewsets.ModelViewSet):
    serializer_class = DeadlineSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # User sees their personal deadlines OR deadlines of groups they belong to
        # N+1 Query Fix: select_related for ForeignKeys (user, group)
        qs = Deadline.objects.select_related('user', 'group').filter(
            Q(user=user) | Q(group__memberships__user=user)
        ).distinct()

        # Filtering
        priority = self.request.query_params.get('priority')
        status_param = self.request.query_params.get('status')
        group_id = self.request.query_params.get('group') # filter by specific group
        
        if priority:
            qs = qs.filter(priority=priority)
        if status_param:
            qs = qs.filter(status=status_param)
        if group_id:
            qs = qs.filter(group__id=group_id)
            
        return qs.order_by('due_date', 'id')

    def _parse_personal_flag(self):
        is_personal = self.request.data.get('is_personal')
        if isinstance(is_personal, str):
            return is_personal.lower() == 'true'
        return is_personal

    def _is_group_null(self, value):
        return value in (None, '', 'null', 'None')

    def _is_user_null(self, value):
        return value in (None, '', 'null', 'None')

    def _display_name(self, user):
        full_name = f"{user.first_name} {user.last_name}".strip()
        return full_name or user.email or user.username

    def _notify_group_deadline_created(self, deadline, actor):
        if not deadline.group:
            return

        recipients = GroupUser.objects.filter(group=deadline.group).exclude(user=actor).select_related('user')
        if not recipients.exists():
            return

        actor_name = self._display_name(actor)
        notification = Notification.objects.create(
            title=f"Nouvelle deadline dans {deadline.group.name}",
            description=(
                f"{actor_name} a créé la deadline '{deadline.name}' "
                f"(échéance le {deadline.due_date})."
            ),
        )

        links = [NotificationUser(notification=notification, user=membership.user) for membership in recipients]
        NotificationUser.objects.bulk_create(links, ignore_conflicts=True)

    def _notify_group_deadline_deleted(self, deadline, actor):
        if not deadline.group:
            return

        recipients = GroupUser.objects.filter(group=deadline.group).exclude(user=actor).select_related('user')
        if not recipients.exists():
            return

        actor_name = self._display_name(actor)
        notification = Notification.objects.create(
            title=f"Deadline supprimée dans {deadline.group.name}",
            description=f"{actor_name} a supprimé la deadline '{deadline.name}'.",
        )

        links = [NotificationUser(notification=notification, user=membership.user) for membership in recipients]
        NotificationUser.objects.bulk_create(links, ignore_conflicts=True)

    def perform_update(self, serializer):
        is_personal = self._parse_personal_flag()

        # Priority 0: explicit ownership fields from frontend payload.
        # Expected contract:
        # - Personal: user=<id>, group=null
        # - Group: user=null, group=<id>
        if 'group' in self.request.data or 'user' in self.request.data:
            group_value = self.request.data.get('group')
            user_value = self.request.data.get('user')
            group_is_null = self._is_group_null(group_value)
            user_is_null = self._is_user_null(user_value)

            if group_is_null and not user_is_null:
                serializer.save(user=self.request.user, group=None)
                return

            if not group_is_null and user_is_null:
                serializer.save(user=None)
                return

            if group_is_null and user_is_null:
                # Prevent orphan deadlines; default to personal for the caller.
                serializer.save(user=self.request.user, group=None)
                return

            raise ValidationError({'detail': 'Une deadline doit être soit personnelle, soit de groupe, pas les deux.'})

        # Priority 1: explicit personal flag from frontend.
        if is_personal is True:
            serializer.save(user=self.request.user, group=None)
            return

        # Priority 2: explicit group field in payload.
        if 'group' in self.request.data:
            group_value = self.request.data.get('group')
            if self._is_group_null(group_value):
                serializer.save(user=self.request.user, group=None)
            else:
                serializer.save(user=None)
            return

        # Priority 3: no ownership fields provided -> keep current ownership.
        serializer.save()

    def create(self, request, *args, **kwargs):
        # Front sends { ..., "is_personal": true/false, "group": <id>/null }
        user = request.user
        if 'group' in request.data or 'user' in request.data:
            group_value = request.data.get('group')
            user_value = request.data.get('user')
            group_is_null = self._is_group_null(group_value)
            user_is_null = self._is_user_null(user_value)

            if group_is_null and not user_is_null:
                data = request.data.copy()
                data['user'] = user.id
                data['group'] = None
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            if not group_is_null and user_is_null:
                data = request.data.copy()
                data['user'] = None
                data['group'] = group_value
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                self._notify_group_deadline_created(serializer.instance, request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            if group_is_null and user_is_null:
                data = request.data.copy()
                data['user'] = user.id
                data['group'] = None
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            raise ValidationError({'detail': 'Une deadline doit être soit personnelle, soit de groupe, pas les deux.'})

        is_personal = self._parse_personal_flag()
        group_id = request.data.get('group')

        # If front explicitly says personal OR sends empty group, create personal.
        if is_personal is True or self._is_group_null(group_id):
            data = request.data.copy()
            data['user'] = user.id
            data['group'] = None
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Otherwise create group deadline.
        data = request.data.copy()
        data['user'] = None
        data['group'] = group_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        self._notify_group_deadline_created(serializer.instance, request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        deadline = self.get_object()
        self._notify_group_deadline_deleted(deadline, request.user)
        self.perform_destroy(deadline)
        return Response(status=status.HTTP_204_NO_CONTENT)

