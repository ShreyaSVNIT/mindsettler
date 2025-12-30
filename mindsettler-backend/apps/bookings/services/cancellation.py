# apps/bookings/services/cancellation.py
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError


def cancel_booking(booking):
    if booking.status != "CONFIRMED":
        raise ValidationError("Only confirmed bookings can be cancelled")

    if not booking.approved_slot_start:
        raise ValidationError("Approved slot not found")

    if timezone.now() > booking.approved_slot_start - timedelta(hours=24):
        raise ValidationError(
            "Cancellation allowed only up to 24 hours before session"
        )

    booking.status = "CANCELLED"
    booking.cancellation_reason = (
        booking.cancellation_reason or "Cancelled by user"
    )

    booking.save(update_fields=["status", "cancellation_reason"])
    return booking