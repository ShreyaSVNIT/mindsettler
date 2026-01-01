from datetime import timedelta
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .guards import assert_transition

CANCELLATION_CUTOFF_HOURS = 24


def _validate_cancellation_window(booking):
    if not booking.approved_slot_start:
        raise ValidationError("Approved slot not found")

    cutoff_time = booking.approved_slot_start - timedelta(
        hours=CANCELLATION_CUTOFF_HOURS
    )

    if timezone.now() > cutoff_time:
        raise ValidationError(
            f"Cancellation allowed only up to "
            f"{CANCELLATION_CUTOFF_HOURS} hours before the session"
        )


def cancel_by_user(booking, reason=None):
    """
    CONFIRMED → CANCELLED
    """
    assert_transition(booking.status, "CANCELLED")
    _validate_cancellation_window(booking)

    booking.status = "CANCELLED"
    booking.cancellation_reason = reason or "Cancelled by user"
    booking.cancelled_at = timezone.now()
    booking.cancelled_by = "USER"

    booking.cancellation_token = None
    booking.cancellation_requested_at = None

    booking.save(update_fields=[
        "status",
        "cancellation_reason",
        "cancelled_at",
        "cancelled_by",
        "cancellation_token",
        "cancellation_requested_at",
    ])

    return booking


def cancel_by_admin(booking, reason=None):
    """
    ADMIN cancellation
    """
    if booking.status not in {"CONFIRMED", "PAYMENT_PENDING"}:
        raise ValidationError(
            "Only confirmed or payment-pending bookings can be cancelled"
        )

    booking.status = "CANCELLED"
    booking.cancellation_reason = reason or "Cancelled by admin"
    booking.cancelled_at = timezone.now()
    booking.cancelled_by = "ADMIN"

    booking.cancellation_token = None
    booking.cancellation_requested_at = None

    booking.save(update_fields=[
        "status",
        "cancellation_reason",
        "cancelled_at",
        "cancelled_by",
        "cancellation_token",
        "cancellation_requested_at",
    ])

    return booking