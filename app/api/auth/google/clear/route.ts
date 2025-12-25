import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();

    // Delete Google cookies
    cookieStore.delete('google_access_token');
    cookieStore.delete('google_refresh_token');

    return NextResponse.json({
        success: true,
        message: 'Google cookies cleared successfully'
    });
}
