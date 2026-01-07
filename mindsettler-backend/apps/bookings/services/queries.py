# apps/bookings/services/queries.py

from apps.bookings.models import Booking

# ─────────────────────────
# SINGLE SOURCE OF TRUTH
# ─────────────────────────
ACTIVE_STATUSES = {
    "DRAFT",
    "PENDING",
    "APPROVED",
    "PAYMENT_PENDING",
    "CONFIRMED",
}


def has_active_booking(user, exclude=None):
    """
    Returns True if the user has any active booking
    (including PAYMENT_PENDING).
    """

    qs = Booking.objects.filter(
        user=user,
        status__in=ACTIVE_STATUSES,
    )

    if exclude is not None:
        qs = qs.exclude(id=exclude.id)

    return qs.exists()


def get_active_booking(user):
    """
    Returns the most recent active booking for the user.
    """

    return (
        Booking.objects.filter(
            user=user,
            status__in=ACTIVE_STATUSES,
        )
        .order_by("-created_at")
        .first()
    )