from django.urls import path
from .views import (
    RegisterView,
    MeView,
    UsersListView,
    MyTokenObtainPairView,
    UpdateAvatarView
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),

    path("register/", RegisterView.as_view()),
    path("me/", MeView.as_view()),
    path("avatar/", UpdateAvatarView.as_view()),
    path("users/", UsersListView.as_view()),
]