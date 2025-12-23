from django.db import models
from django.utils import timezone
from apps.users.models import AppUser
from apps.psychologists.models import Psychologist
from apps.corporates.models import Corporate
import uuid
import random
import string

def generate_acknowledgement_id():
    return "MS-" + "".join(
        random.choices(string.ascii_uppercase + string.digits, k=8)
    )

class Booking(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    SESSION_CHOICES = [
        ("INDIVIDUAL", "Individual"),
        ("COUPLE", "Couple"),
        ("CORPORATE", "Corporate"),
    ]

    user = models.ForeignKey(
        AppUser,
        on_delete=models.CASCADE,
        related_name="bookings",
    )

    session_type = models.CharField(
        max_length=20,
        choices=SESSION_CHOICES,
    )

    preferred_date = models.DateField()
    preferred_time = models.TimeField()

    user_message = models.TextField(blank=True)

    psychologist = models.ForeignKey(
        Psychologist,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    corporate = models.ForeignKey(
        Corporate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    # 🔐 CONSENT (PER BOOKING)
    consent_given = models.BooleanField(
        default=False,
        help_text="Explicit consent given for this booking"
    )

    consent_given_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when consent was given"
    )

    consent_corporate = models.ForeignKey(
        Corporate,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="consented_bookings",
        help_text="Corporate under whose privacy policy consent was taken"
    )
    # 📧 EMAIL VERIFICATION (PER BOOKING)
    email_verified = models.BooleanField(
        default=False,
        help_text="Whether booking email has been verified"
    )

    email_verified_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when email was verified"
    )

    email_verification_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text="Email verification token for this booking"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    acknowledgement_id = models.CharField(
    max_length=20,
    unique=True,
    null=True,
    blank=True,
)
    created_at = models.DateTimeField(auto_now_add=True)
    last_verification_email_sent_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Last time verification email was sent"
)

    def generate_acknowledgement_id(self):
     self.acknowledgement_id = f"MS-{uuid.uuid4().hex[:8].upper()}"
     self.save(update_fields=["acknowledgement_id"])

    def give_consent(self, corporate=None):
        self.consent_given = True
        self.consent_given_at = timezone.now()
        self.consent_corporate = corporate
        self.save(
            update_fields=[
                "consent_given",
                "consent_given_at",
                "consent_corporate",
            ]
        )

    def verify_email(self):
        self.email_verified = True
        self.email_verified_at = timezone.now()
        self.save(
            update_fields=["email_verified", "email_verified_at"]
        )
    
    def save(self, *args, **kwargs):
        if not self.acknowledgement_id:
        # Ensure uniqueness (retry-safe)
            while True:
                ack_id = generate_acknowledgement_id()
                if not Booking.objects.filter(
                acknowledgement_id=ack_id
            ).exists():
                    self.acknowledgement_id = ack_id
                    break

        super().save(*args, **kwargs)

    def __str__(self):
        return self.acknowledgement_id