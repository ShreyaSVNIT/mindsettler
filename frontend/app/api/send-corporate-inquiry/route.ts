import { NextRequest, NextResponse } from 'next/server';

// Reuse same sending strategies as send-contact: SendGrid, SMTP, backend forward
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactPerson,
      email,
      phone,
      industry,
      employeeCount,
      serviceType,
      budgetRange,
      timeline,
      message,
      preferredContactMethod,
      bestTimeToContact,
    } = body;

    // Format email content
    const emailContent = `
New Corporate Wellness Inquiry

COMPANY INFORMATION:
━━━━━━━━━━━━━━━━━━━━
Company Name: ${companyName}
Contact Person: ${contactPerson}
Email: ${email}
Phone: ${phone}
Industry: ${industry}

REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━
Number of Employees: ${employeeCount}
Service Interest: ${serviceType}
Budget Range: ${budgetRange}
Expected Timeline: ${timeline}

ADDITIONAL DETAILS:
━━━━━━━━━━━━━━━━━━━━
Message: 
${message}

Preferred Contact Method: ${preferredContactMethod}
Best Time to Contact: ${bestTimeToContact || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━
Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    // Build a payload and try send via SendGrid, SMTP, or backend forward
    const payload = {
      to: 'mindsettler.dev@gmail.com',
      subject: `Corporate Inquiry from ${companyName}`,
      text: emailContent,
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F9D1D5; border-radius: 10px;">
            <h2 style="color: #E37383; border-bottom: 2px solid #E37383; padding-bottom: 10px;">New Corporate Wellness Inquiry</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3f2965; margin-top: 0;">Company Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Company Name:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Contact Person:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${contactPerson}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #3f2965;"><a href="mailto:${email}" style="color: #E37383;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Industry:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${industry}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3f2965; margin-top: 0;">Requirements</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Employees:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${employeeCount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Service:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${serviceType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Budget:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${budgetRange}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Timeline:</td>
                  <td style="padding: 8px 0; color: #3f2965;">${timeline}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3f2965; margin-top: 0;">Message</h3>
              <p style="color: #3f2965; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              
              <p style="color: #666; margin-top: 15px;">
                <strong>Preferred Contact:</strong> ${preferredContactMethod}<br>
                <strong>Best Time:</strong> ${bestTimeToContact || 'Not specified'}
              </p>
            </div>

            <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
              Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </div>
          </div>
        `,
    };

    // Try SendGrid
    if (await trySendViaSendGrid(payload)) return NextResponse.json({ success: true, message: 'Sent via SendGrid' });

    // Try SMTP
    if (await trySendViaSmtp(payload)) return NextResponse.json({ success: true, message: 'Sent via SMTP' });

    // Forward to backend
    if (await trySendViaBackend(payload)) return NextResponse.json({ success: true, message: 'Forwarded to backend' });

    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Corporate Inquiry (dev fallback):\n', emailContent);
      return NextResponse.json({ success: true, message: 'Inquiry logged (dev mode)' });
    }

    throw new Error('Failed to send email');
  } catch (error) {
    console.error('Error sending corporate inquiry:', error);
    
    // In development, still return success for testing
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, message: 'Inquiry logged (dev mode)' });
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to send inquiry' },
      { status: 500 }
    );
  }
}
