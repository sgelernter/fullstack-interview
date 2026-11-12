from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response


@ensure_csrf_cookie
@api_view(["GET"])
def csrf(_: Request):
    """Sets a csrftoken cookie so the frontend can return it as needed"""
    return Response({"detail": "CSRF cookie set"})
