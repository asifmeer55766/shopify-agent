import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const usersCollection = db.collection('users');

    let userQuery = {};
    try {
      userQuery = { _id: new ObjectId(session.userId) };
    } catch {
      userQuery = { email: session.email };
    }

    await usersCollection.updateOne(userQuery, {
      $set: {
        shopify: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Shopify store disconnected successfully.' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
