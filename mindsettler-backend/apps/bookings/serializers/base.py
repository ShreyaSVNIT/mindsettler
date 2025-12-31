# apps/bookings/serializers/base.py
from rest_framework import serializers
from apps.bookings.models import Booking


class BookingBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

    # 🔒 Required date check
    def validate_preferred_date(self, value):
        if not value:
            raise serializers.ValidationError("Preferred date is required")
        return value

    # 🔒 Time range sanity check
    def validate(self, data):
        start = data.get("preferred_time_start")
        end = data.get("preferred_time_end")

        if start and end and start >= end:
            raise serializers.ValidationError(
                "Preferred start time must be before end time"
            )
        return data