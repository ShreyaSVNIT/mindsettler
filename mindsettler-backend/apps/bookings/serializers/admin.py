from .base import BookingBaseSerializer


class BookingAdminSerializer(BookingBaseSerializer):
    """
    Admin-only serializer.
    Used internally for admin views / APIs.
    Admins can update approval, slots, payments, rejection, etc.
    """

    class Meta(BookingBaseSerializer.Meta):
        read_only_fields = (
            # ───────── Immutable identity ─────────
            "user",
            "acknowledgement_id",

            # ───────── Email verification ─────────
            "email_verified",
            "email_verified_at",
            "last_verification_email_sent_at",

            # ───────── Consent ─────────
            "consent_given",
            "consent_given_at",

            # ───────── Confirmation & cancellation tokens ─────────
            "confirmation_token",
            "cancellation_token",
            "cancellation_requested_at",

            # ───────── System timestamps ─────────
            "created_at",
            "updated_at",
            "submitted_at",
            "approved_at",
            "confirmed_at",
            "cancelled_at",
        )