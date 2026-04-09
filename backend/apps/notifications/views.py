import time
import json
from django.http import StreamingHttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import MethodNotAllowed
from .models import Notification, NotificationUser
from .serializers import NotificationSerializer, NotificationUserSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAdminUser] # Only admins manage raw notifications


class NotificationUserViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return NotificationUser.objects.filter(user=user).select_related('notification').order_by('-notification__date')

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed('POST', detail='Les notifications sont générées par le backend uniquement.')

    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed('PUT', detail='Utilisez les actions dédiées pour modifier le statut de lecture.')

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed('PATCH', detail='Utilisez les actions dédiées pour modifier le statut de lecture.')

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """POST /api/notifications_user/{id}/mark_read/"""
        notif_user = self.get_object()
        notif_user.is_read = True
        notif_user.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """POST /api/notifications_user/mark_all_read/"""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        """DELETE /api/notifications_user/delete_all/"""
        self.get_queryset().delete()
        return Response({'status': 'all deleted'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def stream(self, request):
        """GET /api/notification-users/stream/ (SSE Endpoint)"""
        user = request.user

        def event_stream():
            last_data_hash = None

            while True:
                try:
                    # We fetch full notifications data
                    qs = NotificationUser.objects.filter(user=user).select_related('notification').order_by('-notification__date')
                    data = NotificationUserSerializer(qs, many=True).data
                    # Serialize to string to compare
                    data_str = json.dumps(data)
                    current_hash = hash(data_str)

                    if current_hash != last_data_hash:
                        yield f"data: {data_str}\n\n"
                        last_data_hash = current_hash
                    else:
                        # Keep-alive heartbeat
                        yield ": heartbeat\n\n"
                    
                    time.sleep(5)
                except Exception:
                    break
        
        response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response


