import { NextRequest, NextResponse } from 'next/server';

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

    // Send email using your backend or email service
    // For now, we'll use a simple fetch to your backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    
    const response = await fetch(`${backendUrl}/api/send-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });

    if (!response.ok) {
      // Fallback: Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Corporate Inquiry (Email Service Not Available):\n', emailContent);
        return NextResponse.json({ success: true, message: 'Inquiry logged (dev mode)' });
      }
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true, message: 'Inquiry sent successfully' });
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
