from rest_framework import serializers
from apps.bookings.models import Booking


class BookingPublicSerializer(serializers.ModelSerializer):
    """
    Public-facing booking serializer.
    Safe to expose to users after email verification.
    """

    class Meta:
        model = Booking
        fields = (
            # ───────── Identity ─────────
            "acknowledgement_id",

            # ───────── Status ─────────
            "status",

            # ───────── User preferences ─────────
            "preferred_date",
            "preferred_period",
            "preferred_time_start",
            "preferred_time_end",
            "mode",

            # ───────── Admin-approved slot ─────────
            "approved_slot_start",
            "approved_slot_end",

            # ───────── Metadata ─────────
            "created_at",
        )

        read_only_fields = fields