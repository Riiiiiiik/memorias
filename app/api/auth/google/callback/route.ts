import { google } from 'googleapis';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:3000/api/auth/google/callback'
        );

        const { tokens } = await oauth2Client.getToken(code);

        // Set headers with cookies
        const response = NextResponse.redirect(new URL('/admin?google_connected=true', request.url));

        // Secure cookie for Access Token
        response.cookies.set('google_access_token', tokens.access_token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600, // 1 hour
            path: '/',
        });

        if (tokens.refresh_token) {
            response.cookies.set('google_refresh_token', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });
        }

        return response;

    } catch (error) {
        console.error('OAuth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
