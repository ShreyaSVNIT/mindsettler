# apps/bookings/services/admin.py
from rest_framework.exceptions import ValidationError


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

    booking.status = "APPROVED"
    booking.approved_slot_start = approved_start
    booking.approved_slot_end = approved_end
    booking.psychologist = psychologist
    booking.corporate = corporate

    booking.save(
        update_fields=[
            "status",
            "approved_slot_start",
            "approved_slot_end",
            "psychologist",
            "corporate",
        ]
    )
    return booking


def reject_booking(booking, reason, alternate_slots=""):
    if booking.status not in {"PENDING", "APPROVED"}:
        raise ValidationError("Booking cannot be rejected")

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
    return booking