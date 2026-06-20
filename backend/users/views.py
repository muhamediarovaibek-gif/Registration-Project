from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    MyTokenObtainPairSerializer,
    AvatarSerializer
)

from .models import Profile

User = get_user_model()


# =========================
# LOGIN
# =========================
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# =========================
# REGISTER
# =========================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
            "id": user.id,
        }, status=status.HTTP_201_CREATED)


# =========================
# ME (FIXED)
# =========================
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)

        avatar = (
            request.build_absolute_uri(profile.avatar.url)
            if profile.avatar else None
        )

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "avatar": avatar,
        })


# =========================
# USERS (ADMIN ONLY)
# =========================
class UsersListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()

        return Response([
            {
                "id": u.id,
                "username": u.username,
                "email": u.email
            }
            for u in users
        ])


# =========================
# UPDATE AVATAR
# =========================
class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = AvatarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.avatar = serializer.validated_data["avatar"]
        profile.save()

        return Response({
            "avatar": request.build_absolute_uri(profile.avatar.url)
        })