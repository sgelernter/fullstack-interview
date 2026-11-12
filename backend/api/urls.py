from django.urls import path

from . import views

urlpatterns = [
    path("csrf/", views.csrf),
    path("register/", views.register),
    path("login/", views.login),
    path("logout/", views.logout),
    path("me/", views.me),
    path("products/", views.products),
    path("orders/", views.place_order),
    path("orders/<uuid:order_id>/", views.delete_order),
]
