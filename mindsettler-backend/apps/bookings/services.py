from .models import Booking


def has_active_booking(user):
    return Booking.objects.filter(
        user=user,
        status__in=["PENDING", "CONFIRMED"]
    ).exists()