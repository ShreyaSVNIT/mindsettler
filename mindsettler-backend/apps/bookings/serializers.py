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
            "consent_given",
            "consent_given_at",
            "consent_corporate",
            "created_at",
        )