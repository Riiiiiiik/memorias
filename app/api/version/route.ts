import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/version';

export const dynamic = 'force-dynamic'; // Ensure this is not cached

export async function GET() {
    return NextResponse.json({ version: APP_VERSION });
}
