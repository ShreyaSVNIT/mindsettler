from django.urls import path
from .views import (
    BookingCreateView,
    MyBookingsView,
    VerifyBookingEmailView,
)

urlpatterns = [
    path("create/", BookingCreateView.as_view()),
    path("my/", MyBookingsView.as_view()),
    path("verify-email/", VerifyBookingEmailView.as_view()),
]