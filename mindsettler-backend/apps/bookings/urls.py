from django.urls import path

from .views import (
    BookingDraftCreateView,
    VerifyEmailView,
    ConfirmBookingView,
    CancelBookingView,
    AdminApproveBookingView,
    AdminRejectBookingView,
    RequestCancellationView,
    VerifyCancellationView,
)

urlpatterns = [
    # User flow
    path("draft/", BookingDraftCreateView.as_view(), name="booking-draft"),
    path("verify-email/", VerifyEmailView.as_view(), name="booking-verify-email"),
    path("confirm/", ConfirmBookingView.as_view(), name="booking-confirm"),
        path("request-cancellation/", RequestCancellationView.as_view()),
    path("verify-cancellation/", VerifyCancellationView.as_view()),

    # Admin actions
    path(
        "admin/<int:booking_id>/approve/",
        AdminApproveBookingView.as_view(),
        name="booking-approve",
    ),
    path(
        "admin/<int:booking_id>/reject/",
        AdminRejectBookingView.as_view(),
        name="booking-reject",
    ),
]