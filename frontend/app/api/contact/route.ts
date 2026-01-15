import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter (per-IP). This is suitable for small-scale
// deployments or as a first line of defense. For production, prefer a
// distributed store like Redis so limits persist across server instances.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // max submissions per window
type RateRecord = { count: number; firstRequest: number };
const rateMap = new Map<string, RateRecord>();

function getClientIp(req: NextRequest) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xrip = req.headers.get('x-real-ip');
  if (xrip) return xrip;
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();

    // Cleanup stale entries opportunistically
    for (const [key, rec] of rateMap) {
      if (now - rec.firstRequest > RATE_LIMIT_WINDOW_MS) {
        rateMap.delete(key);
      }
    }

    const existing = rateMap.get(ip);
    if (existing) {
      if (now - existing.firstRequest > RATE_LIMIT_WINDOW_MS) {
        rateMap.set(ip, { count: 1, firstRequest: now });
      } else {
        if (existing.count >= RATE_LIMIT_MAX) {
          return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }
        existing.count += 1;
        rateMap.set(ip, existing);
      }
    } else {
      rateMap.set(ip, { count: 1, firstRequest: now });
    }

    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would integrate with an email service
    // For now, we'll just log it and return success
    console.log('Contact form submission:', { name, email, phone, message, ip });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
