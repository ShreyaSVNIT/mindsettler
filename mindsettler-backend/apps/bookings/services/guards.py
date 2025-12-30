# apps/bookings/services/guards.py
from rest_framework.exceptions import ValidationError


def ensure_email_verified(booking):
    if not booking.email_verified:
        raise ValidationError("Email not verified")


def ensure_status(booking, allowed_statuses):
    if booking.status not in allowed_statuses:
        raise ValidationError(
            f"Invalid booking state: {booking.status}"
        )