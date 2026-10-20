import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { hashPassword, generateToken, AUTH_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validation: Only email and password are required
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const db = await getDb();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password and store in MongoDB
    const passwordHash = await hashPassword(password);
    const now = new Date();

    const insertResult = await usersCollection.insertOne({
      email: normalizedEmail,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      shopify: null, // Initial state: not yet synced with Shopify
    });

    const userId = insertResult.insertedId.toString();
    const token = generateToken({ userId, email: normalizedEmail });

    // Respond with user info and set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: userId,
        email: normalizedEmail,
        hasShopifySync: false,
      },
    });

    response.cookies.set(AUTH_COOKIE.name, token, AUTH_COOKIE.options);
    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
