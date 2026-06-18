from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .serializers import RegisterSerializer

User = get_user_model()


# =========================
# LOGIN (USERNAME + JWT)
# =========================

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # добавляем полезные данные в ответ
        data["username"] = self.user.username
        data["email"] = self.user.email
        data["id"] = self.user.id

        return data


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
        })


# =========================
# ME (current user)
# =========================

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        avatar = None

        if hasattr(request.user, "profile") and request.user.profile.avatar:
            avatar = request.build_absolute_uri(
                request.user.profile.avatar.url
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

class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile = request.user.profile

        if "avatar" not in request.FILES:
            return Response(
                {"error": "Файл не выбран"},
                status=400
            )

        profile.avatar = request.FILES["avatar"]
        profile.save()

        return Response({
            "avatar": request.build_absolute_uri(
                profile.avatar.url
            )
        })