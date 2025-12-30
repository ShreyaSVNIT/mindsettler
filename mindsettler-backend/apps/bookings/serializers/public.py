# apps/bookings/serializers/public.py
from rest_framework import serializers
from apps.bookings.models import Booking


class BookingPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            "acknowledgement_id",
            "status",
            "preferred_date",
            "preferred_period",
            "preferred_time_start",
            "preferred_time_end",
            "mode",
            "approved_slot_start",
            "approved_slot_end",
            "created_at",
        )