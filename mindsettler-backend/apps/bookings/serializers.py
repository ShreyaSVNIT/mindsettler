from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

        read_only_fields = (
            "user",
            "status",
            "acknowledgement_id",
            "email_verified",
            "email_verified_at",
            "consent_given",
            "consent_given_at",
            "consent_corporate",
            "approved_slot_start",
            "approved_slot_end",
            "appointment_date",
            "rejection_reason",
            "alternate_slots",
            "created_at",
            "updated_at",
            "last_verification_email_sent_at",
        )

    # 🔒 Enforce preferred_date at request time
    def validate_preferred_date(self, value):
        if not value:
            raise serializers.ValidationError("Preferred date is required")
        return value

    # 🔒 Optional: sanity check for time range
    def validate(self, data):
        start = data.get("preferred_time_start")
        end = data.get("preferred_time_end")

        if start and end and start >= end:
            raise serializers.ValidationError(
                "Preferred start time must be before end time"
            )

        return data