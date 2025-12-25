'use server';

import { createClient } from "@/lib/supabase/server";

export async function updateSiteContent(key: string, value: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('site_content')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select();

    if (error) {
        console.error('Error updating content:', error);
        throw new Error('Failed to update content: ' + error.message);
    }

    return { success: true };
}

export async function getSiteContent() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('site_content')
        .select('*');

    if (error) {
        console.error('Error fetching content:', error);
        return {};
    }

    // Convert array to object map for easier usage
    const contentMap: Record<string, string> = {};
    data ? data.forEach((item: any) => {
        contentMap[item.key] = item.value;
    }) : null;

    return contentMap;
}
