from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from .models import Booking
from apps.bookings.services import (
    apply_admin_decision,
)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    # ─────────────────────────
    # LIST VIEW
    # ─────────────────────────
    list_display = (
        "acknowledgement_id",
        "user",
        "status",
        "admin_decision",
        "preferred_date",
        "preferred_period",
        "mode",
        "created_at",
    )

    list_filter = (
        "status",
        "admin_decision",
        "mode",
        "preferred_period",
    )

    search_fields = (
        "user__email",
        "acknowledgement_id",
    )

    # ─────────────────────────
    # READ-ONLY (SYSTEM OWNED)
    # ─────────────────────────
    readonly_fields = (
        "user",
        "status",
        "acknowledgement_id",
        "email_verified",
        "email_verified_at",
        "consent_given",
        "consent_given_at",
        "created_at",
        "updated_at",
    )

    # ─────────────────────────
    # FORM LAYOUT
    # ─────────────────────────
    fieldsets = (
        ("User", {
            "fields": (
                "user",
                "email_verified",
                "email_verified_at",
            )
        }),

        ("User Preferences", {
            "fields": (
                "preferred_date",
                "preferred_period",
                "preferred_time_start",
                "preferred_time_end",
                "mode",
                "payment_mode",
                "user_message",
            )
        }),

        ("Admin Decision", {
            "fields": (
                "admin_decision",          
                "approved_slot_start",
                "approved_slot_end",
                "psychologist",
                "corporate",
                "rejection_reason",
                "alternate_slots",
            )
        }),

        ("System", {
            "fields": (
                "status",
                "acknowledgement_id",
                "created_at",
                "updated_at",
            )
        }),
    )

    # ─────────────────────────
    # SAVE LOGIC (CRITICAL)
    # ─────────────────────────
    def save_model(self, request, obj, form, change):
        if change:
            old = Booking.objects.get(pk=obj.pk)

            # 🚫 Terminal state protection
            if old.status in {"COMPLETED", "CANCELLED"}:
                raise ValidationError(
                    "This booking is finalized and cannot be modified."
                )

            # 🎯 Admin decision changed → apply system logic
            if obj.admin_decision != old.admin_decision:
                try:
                    apply_admin_decision(obj)
                except Exception as e:
                    messages.error(request, str(e))
                    return

        super().save_model(request, obj, form, change)