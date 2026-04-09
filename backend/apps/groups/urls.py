from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, GroupUserViewSet

router = DefaultRouter()
router.register(r'groups',      GroupViewSet,     basename='group')
router.register(r'group-users', GroupUserViewSet, basename='group-user')

urlpatterns = router.urls
