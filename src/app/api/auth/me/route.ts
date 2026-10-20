import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    let user = null;
    try {
      user = await usersCollection.findOne({ _id: new ObjectId(session.userId) });
    } catch {
      user = await usersCollection.findOne({ email: session.email });
    }

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt,
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
