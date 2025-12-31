# apps/bookings/services/queries.py
from apps.bookings.models import Booking

ACTIVE_STATUSES = {"DRAFT", "PENDING", "APPROVED", "CONFIRMED"}


def has_active_booking(user, exclude=None):
    qs = Booking.objects.filter(
        user=user,
        status__in=["PENDING", "APPROVED", "CONFIRMED"],
    )

    if exclude is not None:
        qs = qs.exclude(id=exclude.id)

    return qs.exists()


def get_active_booking(user):
    return (
        user.bookings
        .filter(status__in=ACTIVE_STATUSES)
        .order_by("-created_at")
        .first()
    )