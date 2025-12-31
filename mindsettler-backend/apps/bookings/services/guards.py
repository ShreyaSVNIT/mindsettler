# apps/bookings/services/guards.py
from rest_framework.exceptions import ValidationError


# ─────────────────────────
# STATE MACHINE
# ─────────────────────────
ALLOWED_TRANSITIONS = {
    "DRAFT": {"PENDING", "REJECTED"},
    "PENDING": {"APPROVED", "REJECTED"},
    "APPROVED": {"PAYMENT_PENDING", "CANCELLED"},
    "PAYMENT_PENDING": {"CONFIRMED", "PAYMENT_FAILED"},
    "CONFIRMED": {"COMPLETED", "CANCELLED"},
}


def assert_transition(current: str, target: str):
    allowed = ALLOWED_TRANSITIONS.get(current, set())
    if target not in allowed:
        raise ValidationError(
            f"Invalid state transition: {current} → {target}"
        )


# ─────────────────────────
# GENERIC GUARDS (REQUIRED)
# ─────────────────────────
def ensure_status(booking, allowed_statuses: set):
    if booking.status not in allowed_statuses:
        raise ValidationError(
            f"Invalid booking status: {booking.status}"
        )


def ensure_email_verified(booking):
    if not booking.email_verified:
        raise ValidationError("Email not verified")