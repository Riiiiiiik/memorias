import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { files } = body; // Array of { url, name, mimeType }

        if (!files || !Array.isArray(files)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const supabase = await createClient();
        const results = [];

        for (const file of files) {
            try {
                console.log('Importing file:', file.name);

                // 1. Download file from Google
                const response = await fetch(file.url);
                if (!response.ok) {
                    throw new Error(`Failed to download: ${file.name}`);
                }

                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();

                // 2. Determine file type
                const isVideo = file.mimeType?.startsWith('video/');
                const fileExt = file.name?.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
                const fileName = `google-picker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

                // 3. Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from('memorias')
                    .upload(fileName, buffer, {
                        contentType: file.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // 4. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('memorias')
                    .getPublicUrl(fileName);

                // 5. Insert into Database
                const { error: insertError } = await supabase
                    .from('memorias')
                    .insert({
                        title: file.name?.replace(/\.[^/.]+$/, '') || 'Importado do Google',
                        description: 'Importado via Google Picker',
                        date: new Date().toISOString().split('T')[0],
                        image_url: publicUrl,
                        media_type: isVideo ? 'video' : 'image'
                    });

                if (insertError) throw insertError;

                results.push({
                    success: true,
                    name: file.name
                });

            } catch (error: any) {
                console.error('Error importing file:', file.name, error);
                results.push({
                    success: false,
                    name: file.name,
                    error: error.message
                });
            }
        }

        return NextResponse.json({ results });

    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
