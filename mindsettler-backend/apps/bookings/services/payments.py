# apps/bookings/services/payments.py

from uuid import uuid4

from .lifecycle import move_to_payment_pending, confirm_booking


# apps/bookings/services/payments.py
from uuid import uuid4
from rest_framework.exceptions import ValidationError

from .lifecycle import move_to_payment_pending


def initiate_payment(booking):
    """
    Initiate payment safely (idempotent)
    """

    # If already in payment pending, just return existing reference
    if booking.status == "PAYMENT_PENDING":
        return {
            "payment_reference": booking.payment_reference,
            "amount": booking.amount,
        }

    # Only approved bookings can initiate payment
    if booking.status != "APPROVED":
        raise ValidationError(
            f"Cannot initiate payment in status: {booking.status}"
        )

    payment_reference = f"PAY-{uuid4().hex[:12].upper()}"

    move_to_payment_pending(
        booking=booking,
        payment_reference=payment_reference,
    )

    return {
        "payment_reference": payment_reference,
        "amount": booking.amount,
    }

def complete_payment(booking):
    """
    Dummy payment success (gateway callback placeholder)
    """
    confirm_booking(booking)
    return booking


ALLOWED_PAYMENT_MODES = {"ONLINE", "OFFLINE"}


def validate_payment_mode(mode, payment_mode):
    """
    Validates payment configuration during draft creation.
    Keeps frontend + backend consistent.
    """

    if not mode:
        raise ValidationError("Booking mode is required")

    if mode == "ONLINE":
        if not payment_mode:
            raise ValidationError("Payment mode required for online bookings")

        if payment_mode not in {"UPI", "CARD", "NETBANKING"}:
            raise ValidationError("Invalid online payment mode")

    if mode == "OFFLINE":
        if payment_mode:
            raise ValidationError(
                "Payment mode should not be provided for offline bookings")