from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, login_view, register_view

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/login/',    login_view,    name='auth-login'),
    path('auth/register/', register_view, name='auth-register'),
    path('auth/refresh/',  TokenRefreshView.as_view(), name='token_refresh'),
] + router.urls
