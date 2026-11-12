from uuid import UUID

import requests
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Order, User
from .serializers import (
    LoginSerializer,
    MeSerializer,
    OrderSerializer,
    RegisterSerializer,
)


@ensure_csrf_cookie
@api_view(["GET"])
def csrf(_: Request):
    """Sets a csrftoken cookie so the frontend can return it as needed"""
    return Response({"detail": "CSRF cookie set"})


@api_view(["POST"])
def login(request: Request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    # Django's auth functions expect the underlying HttpRequest, not DRF's wrapper
    data = serializer.validated_data
    user = authenticate(request._request, email=data["email"], password=data["password"])
    if not isinstance(user, User):
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    auth_login(request._request, user)
    return Response({"id": user.pk, "email": user.email})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request: Request):
    auth_logout(request._request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def register(request: Request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def products(_: Request):
    response = requests.get("https://fakestoreapi.com/products", timeout=10)
    if not response.ok:
        return Response({"detail": response.text}, status=response.status_code)
    return Response(response.json())


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_order(request: Request):
    serializer = OrderSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(user=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request: Request):
    return Response(MeSerializer(request.user).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_order(request: Request, order_id: UUID):
    # Scoped to the current user, so other users' orders 404
    order = get_object_or_404(Order, pk=order_id, user=request.user)
    if order.status != Order.Status.PLACED:
        return Response(
            {"detail": "Only placed orders can be cancelled"}, status=status.HTTP_400_BAD_REQUEST
        )
    order.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
