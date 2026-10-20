import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { verifyPassword, generateToken, AUTH_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = await getDb();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const userId = user._id.toString();
    const token = generateToken({ userId, email: normalizedEmail });

    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: userId,
        email: normalizedEmail,
        hasShopifySync: Boolean(user.shopify?.connected),
        shopify: user.shopify
          ? {
              storeDomain: user.shopify.storeDomain,
              connected: user.shopify.connected,
              authType: user.shopify.authType,
              lastSyncedAt: user.shopify.lastSyncedAt,
            }
          : null,
      },
    });

    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);
    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
