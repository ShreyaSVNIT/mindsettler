# apps/bookings/services/payments.py

from uuid import uuid4
from rest_framework.exceptions import ValidationError

from .guards import (
    ensure_email_verified,
    ensure_amount_set,
)
from .lifecycle import (
    move_to_payment_pending,
    confirm_booking,
)


# ─────────────────────────
# PAYMENT INITIATION
# ─────────────────────────
def initiate_payment(booking):
    """
    Initiate payment safely (idempotent).
    Email verification is mandatory.
    """

    # 🔒 Guard: email must be verified
    ensure_email_verified(booking)

    # Idempotency
    if booking.status == "PAYMENT_PENDING":
        return {
            "payment_reference": booking.payment_reference,
            "amount": booking.amount,
        }

    # Only approved bookings can pay
    if booking.status != "APPROVED":
        raise ValidationError(
            f"Cannot initiate payment in status: {booking.status}"
        )

    if booking.amount is None:
        raise ValidationError("Payment amount not set")

    payment_reference = f"PAY-{uuid4().hex[:12].upper()}"

    move_to_payment_pending(
        booking=booking,
        payment_reference=payment_reference,
    )

    return {
        "payment_reference": payment_reference,
        "amount": booking.amount,
    }

# ─────────────────────────
# PAYMENT COMPLETION
# ─────────────────────────
def complete_payment(booking):
    """
    Completes payment for a booking.

    Lifecycle:
        PAYMENT_PENDING → CONFIRMED

    Rules:
    - Can only be called once
    - Only allowed from PAYMENT_PENDING
    - CONFIRMED booking is calendar-eligible
    """

    # 🔒 Enforce lifecycle transition
    if booking.status != "PAYMENT_PENDING":
        raise ValidationError(
            f"Payment cannot be completed in status: {booking.status}"
        )

    # ✅ Confirm booking (single source of truth)
    confirm_booking(booking)

    return booking


# ─────────────────────────
# PAYMENT MODE VALIDATION
# ─────────────────────────
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
                "Payment mode should not be provided for offline bookings"
            )