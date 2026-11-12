from django.contrib.auth.models import Group, User 
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .serializers import GroupSerializer, UserSerializer

@ensure_csrf_cookie
@api_view(['GET'])
def csrf(request: Request):
    """Sets a csrftoken cookie so the frontend can return it as needed"""
    return Response({"detail": "CSRF cookie set"})

class UserViewSet(ModelViewSet):
    """
    Endpoint allowing users to be viewed or edited
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GroupViewSet(ModelViewSet):
    """
    Endpoint allowing groups to be viewed or edited
    """
    queryset = Group.objects.all().order_by('-name')
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]