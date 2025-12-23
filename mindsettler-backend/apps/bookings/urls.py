from django.urls import path
from .views import (
    BookingCreateView,
    MyBookingsView,
    VerifyBookingEmailView,
    ResendVerificationEmailView,
    BookingTrackView,
    GetAcknowledgementIdView,
    
)

urlpatterns = [
    path("create/", BookingCreateView.as_view()),
    path("my/", MyBookingsView.as_view()),
    path("verify-email/", VerifyBookingEmailView.as_view()),
    path('resend-verification/', ResendVerificationEmailView.as_view()),
    path('track/',BookingTrackView.as_view()),
    path('get-ack-id/',GetAcknowledgementIdView.as_view())
]