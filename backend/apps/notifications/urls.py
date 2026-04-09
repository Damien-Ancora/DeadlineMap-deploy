from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, NotificationUserViewSet

router = DefaultRouter()
router.register(r'notifications',      NotificationViewSet,     basename='notification')
router.register(r'notification-users', NotificationUserViewSet, basename='notification-user')

urlpatterns = router.urls
