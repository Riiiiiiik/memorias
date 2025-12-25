'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function redeemCoupon(couponId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('coupons')
        .update({
            is_redeemed: true,
            redeemed_at: new Date().toISOString(),
        })
        .eq('id', couponId)
        .select()
        .single();

    if (error) {
        console.error('Error redeeming coupon:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/cupons');
    return { success: true, data };
}
