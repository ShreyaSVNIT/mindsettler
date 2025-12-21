from django.urls import path
from .views import BookingCreateView, MyBookingsView

urlpatterns = [
    path("create/", BookingCreateView.as_view()),
    path("my/", MyBookingsView.as_view()),
]