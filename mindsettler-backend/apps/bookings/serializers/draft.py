# apps/bookings/serializers/draft.py
from .base import BookingBaseSerializer


class BookingDraftSerializer(BookingBaseSerializer):
    class Meta(BookingBaseSerializer.Meta):
        read_only_fields = (
            "user",
            "status",
            "acknowledgement_id",
            "email_verified",
            "email_verified_at",
            "consent_given",
            "consent_given_at",
            "approved_slot_start",
            "approved_slot_end",
            "rejection_reason",
            "alternate_slots",
            "created_at",
            "updated_at",
            "last_verification_email_sent_at",
            "confirmation_token",
            "confirmed_at",
            "cancellation_token",
            "cancellation_requested_at",
        )