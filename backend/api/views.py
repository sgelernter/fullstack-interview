from django.http import HttpResponse, HttpRequest
from django.contrib.auth.models import Group, User 
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .serializers import GroupSerializer, UserSerializer

class UserViewSet(ModelViewSet):
    """
    Endpoint allowing users to be viewed or edited
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class GroupViewSet(ModelViewSet):
    """
    Endpoint allowing groups to be viewed or edited
    """
    queryset = Group.objects.all().order_by('-name')
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]