# apps/bookings/services/cancellation.py

from datetime import timedelta
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .guards import assert_transition

CANCELLATION_CUTOFF_HOURS = 24


def _validate_cancellation_window(booking):
    """
    Applies ONLY to CONFIRMED bookings (paid).
    """
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


# ─────────────────────────
# USER CANCELLATION
# ─────────────────────────
def cancel_by_user(booking, reason=None):
    """
    USER cancellation rules:
    - APPROVED  → immediate cancel (no email, no cutoff)
    - CONFIRMED → email verified + 24h cutoff (handled upstream)
    """

    if booking.status == "APPROVED":
        assert_transition("APPROVED", "CANCELLED")

    elif booking.status == "CONFIRMED":
        assert_transition("CONFIRMED", "CANCELLED")
        _validate_cancellation_window(booking)

    else:
        raise ValidationError(
            "Only approved or confirmed bookings can be cancelled by user"
        )

    booking.status = "CANCELLED"
    booking.cancellation_reason = reason or "Cancelled by user"
    booking.cancelled_at = timezone.now()
    booking.cancelled_by = "USER"

    # Cleanup cancellation flow artifacts
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


# ─────────────────────────
# ADMIN CANCELLATION
# ─────────────────────────
def cancel_by_admin(booking, reason=None):
    """
    ADMIN cancellation:
    - CONFIRMED
    - PAYMENT_PENDING
    - APPROVED
    No restrictions
    """

    if booking.status not in {
        "APPROVED",
        "PAYMENT_PENDING",
        "CONFIRMED",
    }:
        raise ValidationError("Booking cannot be cancelled")

    assert_transition(booking.status, "CANCELLED")

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