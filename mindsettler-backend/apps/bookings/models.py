from django.db import models
from django.utils import timezone
from apps.users.models import AppUser
from apps.psychologists.models import Psychologist
from apps.corporates.models import Corporate
import uuid


class Booking(models.Model):

    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("PAYMENT_PENDING", "Payment Pending"),
        ("CONFIRMED", "Confirmed"),
        ("COMPLETED", "Completed"),
        ("REJECTED", "Rejected"),
        ("CANCELLED", "Cancelled"),
        ("PAYMENT_FAILED", "Payment Failed"),
    ]
    PERIOD_CHOICES = [
        ("MORNING", "Morning"),
        ("EVENING", "Evening"),
        ("CUSTOM", "Custom Range"),
    ]

    MODE_CHOICES = [
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
    ]

    PAYMENT_MODE_CHOICES = [
        ("ONLINE", "Online"),
        ("OFFLINE", "Offline"),
    ]

    # ───────── USER ─────────
    user = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="bookings",
    )

    # ───────── STATE ─────────
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="DRAFT",
    )

    # ───────── USER PREFERENCE ─────────
    preferred_period = models.CharField(
        max_length=10,
        choices=PERIOD_CHOICES,
        null= True,
        blank=True,
    )

    preferred_time_start = models.TimeField(null=True, blank=True)
    preferred_time_end = models.TimeField(null=True, blank=True)
    preferred_date = models.DateField(null=True, blank=True)

    # ───────── SESSION ─────────
    mode = models.CharField(max_length=10, choices=MODE_CHOICES)
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODE_CHOICES)
    user_message = models.TextField(blank=True)

    # ───────── ADMIN ASSIGNMENT ─────────
    psychologist = models.ForeignKey(
        Psychologist, null=True, blank=True, on_delete=models.SET_NULL
    )

    corporate = models.ForeignKey(
        Corporate, null=True, blank=True, on_delete=models.SET_NULL
    )

    approved_slot_start = models.DateTimeField(null=True, blank=True)
    approved_slot_end = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="When admin approved the booking"
)


    rejection_reason = models.TextField(blank=True)
    alternate_slots = models.TextField(blank=True)

    # ───────── CONSENT ─────────
    consent_given = models.BooleanField(default=False)
    consent_given_at = models.DateTimeField(null=True, blank=True)

    # ───────── EMAIL VERIFICATION ─────────
    email_verified = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField(null=True, blank=True)

    email_verification_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    last_verification_email_sent_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)


    # ───────── ACKNOWLEDGEMENT ─────────
    acknowledgement_id = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
    )

    # ───────── USER CONFIRMATION ─────────
    confirmation_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    confirmed_at = models.DateTimeField(null=True, blank=True)
    #------------PAYMENT--------

    payment_reference = models.CharField(
        max_length=100, null=True, blank=True
    )

    payment_requested_at = models.DateTimeField(
        null=True, blank=True
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    confirmed_at = models.DateTimeField(
        null=True, blank=True
    )


    # ───────── Cancellation Flow ─────────
    cancellation_reason = models.TextField(
        blank=True,
        null=True
    )

    cancelled_at = models.DateTimeField(
        blank=True,
        null=True
    )

    cancelled_by = models.CharField(
        max_length=20,
        choices=(
            ("USER", "User"),
            ("ADMIN", "Admin"),
        ),
        blank=True,
        null=True
    )
    cancellation_token = models.UUIDField(
        null=True,
        blank=True,
        db_index=True,   # index but NOT unique
    )
    cancellation_requested_at = models.DateTimeField(
        null=True,
        blank=True
    )
    
    # ───────── TIMESTAMPS ─────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # ───────── DOMAIN METHODS ─────────
    def generate_acknowledgement_id(self):
        if not self.acknowledgement_id:
            self.acknowledgement_id = f"MS-{uuid.uuid4().hex[:8].upper()}"
            self.save(update_fields=["acknowledgement_id"])

    def verify_email(self):
        self.email_verified = True
        self.email_verified_at = timezone.now()
        self.save(update_fields=["email_verified", "email_verified_at"])

    def can_cancel(self):
        return (
            self.status == "CONFIRMED"
            and self.approved_slot_start
            and timezone.now()
            <= self.approved_slot_start - timezone.timedelta(hours=24)
        )

    def __str__(self):
        return self.acknowledgement_id or f"Booking-{self.id}"
    class Meta:
        ordering = ["-created_at"]