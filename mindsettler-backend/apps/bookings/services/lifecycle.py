# apps/bookings/services/lifecycle.py
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .guards import ensure_email_verified, ensure_status


def submit_booking(booking):
    ensure_email_verified(booking)
    ensure_status(booking, {"DRAFT"})

    booking.status = "PENDING"
    booking.save(update_fields=["status"])
    return booking


def confirm_booking(booking):
    ensure_status(booking, {"APPROVED"})

    booking.status = "CONFIRMED"
    booking.confirmed_at = timezone.now()
    booking.save(update_fields=["status", "confirmed_at"])

    return booking