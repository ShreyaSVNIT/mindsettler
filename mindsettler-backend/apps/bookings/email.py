import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings
from django.utils import timezone
import uuid

def send_booking_verification_email(booking):
    """
    Sends email verification link for a booking
    """

    verification_url = (
        f"{settings.FRONTEND_URL}/verify-booking"
        f"?token={booking.email_verification_token}"
    )

    message = Mail(
        from_email="mindsettler.dev@gmail.com",
        to_emails=booking.user.email,
        subject="Verify your booking – MindSettler",
        html_content=f"""
        <p>Hello,</p>

        <p>Please verify your booking by clicking the link below:</p>

        <p>
            <a href="{verification_url}">
                Verify Booking
            </a>
        </p>

        <p>If you did not request this booking, please ignore this email.</p>

        <br />
        <p>– MindSettler Team</p>
        """,
    )
    message.reply_to = "mindsettler.dev@gmail.com"

    sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])
    sg.send(message)
    booking.last_verification_email_sent_at = timezone.now()
    booking.save(update_fields=["last_verification_email_sent_at"])


def send_cancellation_verification_email(booking):
    """
    Sends email to verify booking cancellation
    """

    # Generate fresh token every time
    booking.cancellation_token = uuid.uuid4()
    booking.cancellation_requested_at = timezone.now()
    booking.save(update_fields=["cancellation_token", "cancellation_requested_at"])

    cancel_url = (
        f"{settings.FRONTEND_URL}/verify-cancellation"
        f"?token={booking.cancellation_token}"
    )

    message = Mail(
        from_email=settings.DEFAULT_FROM_EMAIL,
        to_emails=booking.user.email,
        subject="Confirm Cancellation – MindSettler",
        html_content=f"""
        <p>Hello,</p>

        <p>You requested to cancel your session.</p>

        <p><strong>Session ID:</strong> {booking.acknowledgement_id}</p>

        <p>Please confirm your cancellation by clicking the link below:</p>

        <p>
            <a href="{cancel_url}">
                Confirm Cancellation
            </a>
        </p>

        <p>
            ⚠️ This action is irreversible.
            If you did not request this, please ignore this email.
        </p>

        <br />
        <p>– MindSettler Team</p>
        """,
    )

    sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
    sg.send(message)

