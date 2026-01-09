from django.urls import path
from django.http import HttpResponse, JsonResponse
from django.contrib import admin, messages

from .models import Booking
from apps.bookings.services import approve_booking, reject_booking
from apps.bookings.email import (
    send_booking_approved_email,
    send_booking_rejected_email,
)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "calendar/",
                self.admin_site.admin_view(self.calendar_view),
                name="booking-calendar",
            ),
            path(
                "calendar/data/",
                self.admin_site.admin_view(self.calendar_data_view),
                name="booking-calendar-data",
            ),
            path(
                "calendar/list/",
                self.admin_site.admin_view(self.calendar_list_view),
                name="booking-calendar-list",
            ),
        ]
        return custom_urls + urls

    def calendar_view(self, request):
        return HttpResponse("""
<!DOCTYPE html>
<html>
<head>
    <title>Booking Calendar</title>
    <meta charset="utf-8" />
    <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont;
            background: #f5f7fa;
            color: #333;
        }
        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto 20px auto;
            padding: 10px 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .toolbar h1 {
            margin: 0;
            font-weight: 600;
            font-size: 1.5rem;
            color: #111827;
        }
        #calendar {
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 15px;
        }
        .fc {
            border-radius: 12px;
            font-size: 14px;
        }
        .fc .fc-toolbar-title {
            font-weight: 600;
            font-size: 1.25rem;
            color: #111827;
        }
        .fc .fc-button {
            background-color: #2563eb;
            border: none;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            padding: 6px 12px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .fc .fc-button:hover {
            background-color: #1e40af;
        }
        .fc-event {
            border-radius: 8px !important;
            font-size: 0.9rem !important;
            font-weight: 600;
            color: white !important;
            padding: 4px 6px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <h1>Booking Calendar</h1>
        <div>
            <button type="button" id="prevBtn">Prev</button>
            <button type="button" id="nextBtn">Next</button>
            <button type="button" id="todayBtn">Today</button>
        </div>
    </div>
    <div id="calendar"></div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const calendarEl = document.getElementById('calendar');

            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'timeGridWeek',
                slotMinTime: '08:00:00',
                slotMaxTime: '22:00:00',
                allDaySlot: false,
                nowIndicator: true,
                headerToolbar: {
                    left: '',
                    center: 'title',
                    right: ''
                },
                events: '/admin/bookings/booking/calendar/data/',
                eventDidMount: function(info) {
                    const status = info.event.extendedProps.status;
                    if (status === 'CONFIRMED') {
                        info.el.style.backgroundColor = '#16a34a';
                    } else if (status === 'APPROVED') {
                        info.el.style.backgroundColor = '#2563eb';
                    }
                },
                eventClick: function(info) {
                    const bookingId = info.event.id;
                    const adminUrl = `/admin/bookings/booking/${bookingId}/change/`;
                    window.open(adminUrl, '_blank');
                }
            });

            calendar.render();

            document.getElementById('prevBtn').addEventListener('click', function() {
                calendar.prev();
            });
            document.getElementById('nextBtn').addEventListener('click', function() {
                calendar.next();
            });
            document.getElementById('todayBtn').addEventListener('click', function() {
                calendar.today();
            });
        });
    </script>
</body>
</html>
        """)

    def calendar_list_view(self, request):
        bookings = self.get_calendar_queryset()
        html = """
<!DOCTYPE html>
<html>
<head>
    <title>Booking List View</title>
    <meta charset="utf-8" />
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont;
            background: #f5f7fa;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1 {
            max-width: 1200px;
            margin: 0 auto 20px auto;
            font-weight: 600;
            font-size: 1.75rem;
            color: #111827;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        thead {
            background: #2563eb;
            color: white;
        }
        th, td {
            text-align: left;
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        tbody tr:hover {
            background-color: #f3f4f6;
            cursor: pointer;
        }
        a {
            color: inherit;
            text-decoration: none;
            display: block;
            width: 100%;
            height: 100%;
        }
        @media (max-width: 768px) {
            table, thead, tbody, th, td, tr {
                display: block;
            }
            thead tr {
                display: none;
            }
            tbody tr {
                margin-bottom: 15px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                background: #fff;
                padding: 12px 16px;
            }
            tbody td {
                border: none;
                padding: 8px 0;
                font-size: 13px;
                position: relative;
                padding-left: 50%;
                text-align: left;
            }
            tbody td::before {
                position: absolute;
                top: 8px;
                left: 16px;
                width: 45%;
                white-space: nowrap;
                font-weight: 600;
                content: attr(data-label);
                color: #6b7280;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <h1>Booking List View</h1>
    <table>
        <thead>
            <tr>
                <th>Acknowledgement ID</th>
                <th>Name</th>
                <th>Psychologist</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Mode</th>
            </tr>
        </thead>
        <tbody>
"""
        for b in bookings:
            psychologist = str(b.psychologist) if b.psychologist else "-"
            start = b.approved_slot_start.strftime("%Y-%m-%d %H:%M") if b.approved_slot_start else "-"
            end = b.approved_slot_end.strftime("%Y-%m-%d %H:%M") if b.approved_slot_end else "-"
            url = f"/admin/bookings/booking/{b.id}/change/"
            html += f"""
            <tr onclick="window.open('{url}', '_blank')">
                <td data-label="Acknowledgement ID"><a href="{url}" target="_blank" rel="noopener">{b.acknowledgement_id}</a></td>
                <td data-label="Name"><a href="{url}" target="_blank" rel="noopener">{b.full_name}</a></td>
                <td data-label="Psychologist"><a href="{url}" target="_blank" rel="noopener">{psychologist}</a></td>
                <td data-label="Start"><a href="{url}" target="_blank" rel="noopener">{start}</a></td>
                <td data-label="End"><a href="{url}" target="_blank" rel="noopener">{end}</a></td>
                <td data-label="Status"><a href="{url}" target="_blank" rel="noopener">{b.status}</a></td>
                <td data-label="Mode"><a href="{url}" target="_blank" rel="noopener">{b.mode}</a></td>
            </tr>
"""
        html += """
        </tbody>
    </table>
</body>
</html>
"""
        return HttpResponse(html)

    def calendar_data_view(self, request):
        return JsonResponse(self.get_calendar_events(), safe=False)

    # ─────────────────────────
    # CALENDAR DATA (STEP 2)
    # ─────────────────────────
    def get_calendar_queryset(self):
        """
        Fetch bookings that should appear on admin calendar
        """
        return Booking.objects.filter(
            status__in=["APPROVED", "CONFIRMED"],
            approved_slot_start__isnull=False,
            approved_slot_end__isnull=False,
        ).select_related("psychologist", "corporate")

    def get_calendar_events(self):
        """
        Return bookings in calendar-friendly format
        """
        events = []
        for booking in self.get_calendar_queryset():
            events.append({
                "id": booking.id,
                "title": f"{booking.full_name} ({booking.mode})",
                "start": booking.approved_slot_start,
                "end": booking.approved_slot_end,
                "status": booking.status,
                "psychologist": (
                    str(booking.psychologist)
                    if booking.psychologist else None
                ),
            })
        return events

    # ─────────────────────────
    # QUERYSET
    # ─────────────────────────
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Hide unverified drafts
        return qs.exclude(status="DRAFT")

    # ─────────────────────────
    # LIST VIEW
    # ─────────────────────────
    list_display = (
        "acknowledgement_id",
        "full_name",
        "user_email",
        "phone_number",
        "city",
        "status",
        "preferred_date",
        "preferred_period",
        "mode",
        "created_at",
    )

    list_filter = (
        "status",
        "mode",
        "preferred_period",
        "city",
    )

    search_fields = (
        "acknowledgement_id",
        "full_name",
        "user__email",
        "phone_number",
        "city",
    )

    ordering = ("-created_at",)
    actions = ["approve_bookings", "reject_bookings"]

    # ─────────────────────────
    # READ ONLY
    # ─────────────────────────
    readonly_fields = (
        "acknowledgement_id",
        "user",
        "email_verified",
        "email_verified_at",
        "consent_given",
        "consent_given_at",
        "created_at",
        "updated_at",
        "cancelled_at",
        "cancelled_by",
    )

    # ─────────────────────────
    # FORM LAYOUT
    # ─────────────────────────
    fieldsets = (
        ("Personal Details", {
            "fields": (
                "full_name",
                "phone_number",
                "city",
                "user",
            )
        }),
        ("Verification", {
            "fields": (
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
                "approved_slot_start",
                "approved_slot_end",
                "amount",
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
    # DISPLAY HELPERS
    # ─────────────────────────
    @admin.display(description="Email")
    def user_email(self, obj):
        return obj.user.email if obj.user else "-"

    # ─────────────────────────
    # SAVE VALIDATION
    # ─────────────────────────
    def save_model(self, request, obj, form, change):

        # Prevent edits to finalized bookings
        if change:
            old = Booking.objects.get(pk=obj.pk)
            if old.status in {"COMPLETED", "CANCELLED"}:
                self.message_user(
                    request,
                    "This booking is finalized and cannot be modified.",
                    level=messages.ERROR,
                )
                return

        # Slot sanity checks
        if obj.approved_slot_start and obj.approved_slot_end:
            if obj.approved_slot_end <= obj.approved_slot_start:
                self.message_user(
                    request,
                    "Approved end time must be after start time.",
                    level=messages.ERROR,
                )
                return

            overlapping = Booking.objects.filter(
                status__in=["APPROVED", "CONFIRMED"],
                psychologist=obj.psychologist,
                approved_slot_start__lt=obj.approved_slot_end,
                approved_slot_end__gt=obj.approved_slot_start,
            ).exclude(pk=obj.pk)

            if overlapping.exists():
                messages.warning(
                    request,
                    "⚠️ This slot overlaps with another approved/confirmed booking."
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
                    f"{booking.acknowledgement_id}: Not pending."
                )
                continue

            if not booking.approved_slot_start or not booking.approved_slot_end:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: Slot start & end required."
                )
                continue

            if booking.amount is None:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: Amount required."
                )
                continue

            try:
                approve_booking(
                    booking=booking,
                    approved_start=booking.approved_slot_start,
                    approved_end=booking.approved_slot_end,
                    amount=booking.amount,
                    psychologist=booking.psychologist,
                    corporate=booking.corporate,
                )

                # ✅ EMAIL NOTIFICATION (Step 6)
                send_booking_approved_email(booking)

                messages.success(
                    request,
                    f"{booking.acknowledgement_id}: Approved successfully."
                )

            except Exception as e:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: {str(e)}"
                )

    @admin.action(description="Reject selected bookings")
    def reject_bookings(self, request, queryset):
        for booking in queryset:

            if booking.status != "PENDING":
                messages.warning(
                    request,
                    f"{booking.acknowledgement_id}: Not pending."
                )
                continue

            if not booking.rejection_reason:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: Rejection reason required."
                )
                continue

            try:
                reject_booking(
                    booking=booking,
                    reason=booking.rejection_reason,
                    alternate_slots=booking.alternate_slots,
                )

                # ✅ EMAIL NOTIFICATION (Step 6)
                send_booking_rejected_email(booking)

                messages.success(
                    request,
                    f"{booking.acknowledgement_id}: Rejected successfully."
                )

            except Exception as e:
                messages.error(
                    request,
                    f"{booking.acknowledgement_id}: {str(e)}"
                )