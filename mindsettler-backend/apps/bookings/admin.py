from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from .models import Booking
from apps.bookings.services import approve_booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    # ─────────────────────────
    # LIST VIEW
    # ─────────────────────────
    list_display = (
        "id",
        "user",
        "status",
        "preferred_period",
        "mode",
        "created_at",
    )

    list_filter = (
        "status",
        "mode",
        "preferred_period",
    )

    search_fields = (
        "user__email",
        "acknowledgement_id",
    )

    # ─────────────────────────
    # READ-ONLY SAFETY
    # ─────────────────────────
    readonly_fields = (
        "user",
        "email_verified",
        "email_verified_at",
        "consent_given",
        "consent_given_at",
        "acknowledgement_id",
        "status",            # ❗ status can only change via actions
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
                "preferred_period",
                "preferred_time_start",
                "preferred_time_end",
                "mode",
                "payment_mode",
                "user_message",
                "preferred_date",
            )
        }),

        ("Admin Decision", {
            "fields": (
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
    # IMMUTABLE STATE PROTECTION
    # ─────────────────────────
    def save_model(self, request, obj, form, change):
        if change:
            old = Booking.objects.get(pk=obj.pk)

            if old.status in {"COMPLETED", "CANCELLED", "REJECTED"}:
                raise ValidationError(
                    "This booking is in a terminal state and cannot be modified."
                )

        super().save_model(request, obj, form, change)

    # ─────────────────────────
    # ADMIN ACTIONS
    # ─────────────────────────
    @admin.action(description="Approve selected bookings")
    def approve_bookings(self, request, queryset):
        for booking in queryset:
            if booking.status != "PENDING":
                messages.warning(
                    request,
                    f"Booking {booking.id} is not pending and was skipped."
                )
                continue

            if not booking.approved_slot_start or not booking.approved_slot_end:
                messages.error(
                    request,
                    f"Booking {booking.id} must have approved slot start & end."
                )
                continue

            try:
                approve_booking(
                    booking,
                    approved_start=booking.approved_slot_start,
                    approved_end=booking.approved_slot_end,
                    psychologist=booking.psychologist,
                    corporate=booking.corporate,
                )
            except Exception as e:
                messages.error(
                    request,
                    f"Booking {booking.id} failed to approve: {str(e)}"
                )
                continue

        self.message_user(
            request,
            "Approval action completed. Check messages for details."
        )

    @admin.action(description="Mark selected bookings as completed")
    def mark_completed(self, request, queryset):
        for booking in queryset:
            if booking.status != "CONFIRMED":
                continue

            booking.status = "COMPLETED"
            booking.save(update_fields=["status"])

        self.message_user(
            request,
            "Selected bookings marked as completed."
        )

    actions = [
        approve_bookings,
        mark_completed,
    ]