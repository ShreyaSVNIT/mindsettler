from .models import SessionRequest

ACTIVE_STATUSES = ("pending", "approved")

def has_active_request(user):
    return SessionRequest.objects.filter(
        user=user,
        status__in=ACTIVE_STATUSES
    ).exists()