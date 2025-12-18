from rest_framework import serializers
from .models import SessionRequest


class SessionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionRequest
        fields = (
            "id",
            "requested_slot",
            "status",
            "admin_comment",
            "created_at",
        )
        read_only_fields = ("status", "admin_comment", "created_at")