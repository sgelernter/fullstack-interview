from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

urlpatterns = [
    path("csrf/", views.csrf),
    path("", include(router.urls)),
]
