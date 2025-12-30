from django.urls import path

from .views import (
    BookingDraftCreateView,
    VerifyEmailView,
    ConfirmBookingView,
    AdminApproveBookingView,
    AdminRejectBookingView,
    RequestCancellationView,
    VerifyCancellationView,
)

urlpatterns = [
    # ───────── User flow ─────────
    path("draft/", BookingDraftCreateView.as_view(), name="booking-draft"),
    path("verify-email/", VerifyEmailView.as_view(), name="booking-verify-email"),
    path("confirm/", ConfirmBookingView.as_view(), name="booking-confirm"),

    path(
        "request-cancellation/",
        RequestCancellationView.as_view(),
        name="booking-request-cancellation",
    ),
    path(
        "verify-cancellation/",
        VerifyCancellationView.as_view(),
        name="booking-verify-cancellation",
    ),

    # ───────── Admin flow ─────────
    path(
        "admin/bookings/<int:booking_id>/approve/",
        AdminApproveBookingView.as_view(),
        name="admin-booking-approve",
    ),
    path(
        "admin/bookings/<int:booking_id>/reject/",
        AdminRejectBookingView.as_view(),
        name="admin-booking-reject",
    ),
]