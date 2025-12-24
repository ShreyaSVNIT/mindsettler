from .models import Booking


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
        raise ValueError("Cannot reject booking in current state")

    booking.status = "REJECTED"
    booking.rejection_reason = reason
    booking.alternate_slots = alternate_slots
    booking.save()

def confirm_booking(booking):
    ensure_email_verified(booking)

    if booking.status != "APPROVED":
        raise ValueError("Only approved bookings can be confirmed")

    booking.status = "CONFIRMED"
    booking.generate_acknowledgement_id()
    booking.save()

def cancel_booking(booking):
    ensure_email_verified(booking)

    if not booking.can_cancel():
        raise ValueError("Cancellation not allowed")

    booking.mark_cancelled()

def validate_payment_mode(mode, payment_mode):
    if mode == "ONLINE" and payment_mode != "ONLINE":
        raise ValueError("Online sessions require online payment")
    
def apply_admin_decision(booking):
    if booking.admin_decision == "APPROVED":
        approve_booking(
            booking,
            approved_start=booking.approved_slot_start,
            approved_end=booking.approved_slot_end,
            psychologist=booking.psychologist,
            corporate=booking.corporate,
        )

    elif booking.admin_decision == "REJECTED":
        reject_booking(
            booking,
            reason=booking.rejection_reason,
            alternate_slots=booking.alternate_slots,
        )