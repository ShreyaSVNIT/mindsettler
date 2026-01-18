import { NextRequest, NextResponse } from 'next/server';

// Server-side helper: try SendGrid, then SMTP, then forward to backend URL, else log in dev
async function trySendViaBackend(payload: any) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return false;
  try {
    const resp = await fetch(`${backendUrl}/api/send-email/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return resp.ok;
  } catch (e) {
    console.error('Forward to backend failed', e);
    return false;
  }
}

async function trySendViaSendGrid(payload: any) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return false;
  try {
    const sgResp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to || 'mindsettler.dev@gmail.com' }] }],
        from: { email: process.env.DEFAULT_FROM_EMAIL || 'mindsettler.dev@gmail.com', name: 'MindSettler' },
        subject: payload.subject,
        content: [{ type: 'text/plain', value: payload.text }],
      }),
    });
    return sgResp.ok;
  } catch (e) {
    console.error('SendGrid send failed', e);
    return false;
  }
}

async function trySendViaSmtp(payload: any) {
  // Use Nodemailer only if available in runtime; dynamic import to avoid client bundling
  try {
    // @ts-ignore
    const nodemailer = await import('nodemailer');
    const user = process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_PASS;
    if (!user || !pass) return false;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `MindSettler <${user}>`,
      to: payload.to || 'mindsettler.dev@gmail.com',
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    return true;
  } catch (e) {
    console.error('SMTP send failed', e);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, phone, hearAbout, message } = body;

    const text = `Contact form submission\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nHeard about: ${hearAbout || 'N/A'}\n\nMessage:\n${message}`;

    const payload = {
      to: 'mindsettler.dev@gmail.com',
      subject: `Website contact from ${fullName || email || 'website visitor'}`,
      text,
      html: `<pre style="white-space:pre-wrap">${text}</pre>`,
    };

    // Try SendGrid
    if (await trySendViaSendGrid(payload)) return NextResponse.json({ success: true });

    // Try SMTP (nodemailer)
    if (await trySendViaSmtp(payload)) return NextResponse.json({ success: true });

    // Forward to backend if configured
    if (await trySendViaBackend(payload)) return NextResponse.json({ success: true });

    // Development fallback: log and return success so dev flow continues
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact email (dev fallback):', payload);
      return NextResponse.json({ success: true, message: 'Logged (dev fallback)' });
    }

    return NextResponse.json({ success: false, error: 'No mailer available' }, { status: 500 });
  } catch (err) {
    console.error('Error in send-contact route', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
