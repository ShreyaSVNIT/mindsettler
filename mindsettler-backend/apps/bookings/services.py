from .models import Booking
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError



def has_active_booking(user, exclude=None):
    qs = Booking.objects.filter(
        user=user,
        status__in=["PENDING", "APPROVED", "CONFIRMED"]
    )

    if exclude is not None:
        qs = qs.exclude(id=exclude.id)

    return qs.exists()
ACTIVE_STATUSES = {"DRAFT", "PENDING", "APPROVED", "CONFIRMED"}

def get_active_booking(user):
    return (
        user.bookings
        .filter(status__in=ACTIVE_STATUSES)
        .order_by("-created_at")
        .first()
    )
def ensure_email_verified(booking):
    if not booking.email_verified:
        raise ValueError("Email not verified")
    
from django.utils import timezone

def submit_booking(booking):
    ensure_email_verified(booking)

    if booking.status != "DRAFT":
        raise ValueError("Only draft bookings can be submitted")

    booking.status = "PENDING"
    booking.save(update_fields=["status"])

def approve_booking(
    booking,
    approved_start,
    approved_end,
    psychologist=None,
    corporate=None,
):
    if booking.status != "PENDING":
        raise ValueError("Only pending bookings can be approved")

    booking.status = "APPROVED"
    booking.approved_slot_start = approved_start
    booking.approved_slot_end = approved_end
    booking.psychologist = psychologist
    booking.corporate = corporate
    booking.save()

def reject_booking(booking, reason, alternate_slots=""):
    if booking.status not in {"PENDING", "APPROVED"}:
        raise ValidationError("Only pending or approved bookings can be rejected")

    if not reason:
        raise ValidationError("Rejection reason is required")

    booking.status = "REJECTED"
    booking.rejection_reason = reason
    booking.alternate_slots = alternate_slots

    booking.save(update_fields=[
        "status",
        "rejection_reason",
        "alternate_slots",
    ])

    # TODO: send rejection email
    return booking

def confirm_booking(booking):
    if booking.status != "APPROVED":
        raise ValidationError("Booking is not awaiting confirmation")

    booking.status = "CONFIRMED"
    booking.confirmed_at = timezone.now()

    booking.save(update_fields=["status", "confirmed_at"])

    # TODO: send confirmation success email
    return booking


def validate_payment_mode(mode, payment_mode):
    if mode == "ONLINE" and payment_mode != "ONLINE":
        raise ValueError("Online sessions require online payment")
    

def apply_admin_decision(
    booking,
    *,
    decision,
    approved_start=None,
    approved_end=None,
    psychologist=None,
    corporate=None,
    rejection_reason=None,
    alternate_slots=None,
):
    """
    Applies admin decision on a booking.
    decision: 'APPROVED' or 'REJECTED'
    """

    if booking.status != "PENDING":
        raise ValidationError("Only pending bookings can be decided.")

    if decision == "APPROVED":
        if not approved_start or not approved_end:
            raise ValidationError(
                "Approved slot start and end are required."
            )

        booking.status = "APPROVED"
        booking.approved_slot_start = approved_start
        booking.approved_slot_end = approved_end
        booking.psychologist = psychologist
        booking.corporate = corporate

    elif decision == "REJECTED":
        if not rejection_reason:
            raise ValidationError("Rejection reason is required.")

        booking.status = "REJECTED"
        booking.rejection_reason = rejection_reason
        booking.alternate_slots = alternate_slots or ""

    else:
        raise ValidationError("Invalid admin decision.")

    booking.save()
    return booking
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError


def cancel_booking(booking):
    """
    Cancels a booking if cancellation rules are satisfied.
    """

    if booking.status != "CONFIRMED":
        raise ValidationError(
            "Only confirmed bookings can be cancelled."
        )

    if not booking.approved_slot_start:
        raise ValidationError(
            "Approved slot not found for this booking."
        )

    # ⏰ 24-hour rule
    if timezone.now() > booking.approved_slot_start - timedelta(hours=24):
        raise ValidationError(
            "Cancellation is only allowed up to 24 hours before the session."
        )

    booking.status = "CANCELLED"
    booking.cancellation_reason = booking.cancellation_reason or "Cancelled by user"
    booking.save(update_fields=["status", "cancellation_reason"])

    return booking

def approve_booking(
    booking,
    approved_start,
    approved_end,
    psychologist=None,
    corporate=None,
):
    if booking.status != "PENDING":
        raise ValidationError("Only pending bookings can be approved")

    if approved_start >= approved_end:
        raise ValidationError("Invalid approved slot")

    booking.approved_slot_start = approved_start
    booking.approved_slot_end = approved_end
    booking.psychologist = psychologist
    booking.corporate = corporate
    booking.status = "APPROVED"

    booking.save(
        update_fields=[
            "approved_slot_start",
            "approved_slot_end",
            "psychologist",
            "corporate",
            "status",
        ]
    )

    # TODO: send approval email with confirmation link
    return booking