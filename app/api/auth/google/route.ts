import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/api/auth/google/callback'
    );

    const scopes = [
        'https://www.googleapis.com/auth/photoslibrary.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Request refresh token
        scope: scopes,
        prompt: 'consent' // Force consent to ensure refresh token
    });

    return NextResponse.redirect(url);
}
