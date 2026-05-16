from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny # the registration view can be accesed by anyone, even if they are not authenticated. This is important for a registration endpoint, as it allows new users to create accounts without needing to log in first.


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes =[AllowAny]
