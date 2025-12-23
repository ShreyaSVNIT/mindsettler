import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.conf import settings


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