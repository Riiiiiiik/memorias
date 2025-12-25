'use client';

import { redeemCoupon } from '@/app/actions/coupons';
import { useState } from 'react';

interface CouponCardProps {
    id: string;
    title: string;
    description: string;
    emoji: string;
    isRedeemed: boolean;
    redeemedAt?: string;
}

export function CouponCard({
    id,
    title,
    description,
    emoji,
    isRedeemed,
    redeemedAt,
}: CouponCardProps) {
    const [isRedeeming, setIsRedeeming] = useState(false);

    const handleRedeem = async () => {
        if (isRedeemed) return;

        const confirmed = confirm(`Tem certeza que quer resgatar: ${title}?`);
        if (!confirmed) return;

        setIsRedeeming(true);
        const result = await redeemCoupon(id);
        setIsRedeeming(false);

        if (!result.success) {
            alert('Erro ao resgatar cupom. Tente novamente.');
        }
    };

    return (
        <div
            className={`relative bg-gray-900/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transition-all duration-300 ${isRedeemed
                    ? 'opacity-50'
                    : 'hover:bg-gray-800/60 active:scale-[0.98]'
                }`}
        >
            <div className="flex items-start gap-4">
                {/* Emoji */}
                <div className="text-4xl flex-shrink-0">{emoji}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-white/50 text-sm leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                    {isRedeemed ? (
                        <div className="text-center">
                            <div className="text-xs font-medium text-green-400">
                                ✓ Usado
                            </div>
                            {redeemedAt && (
                                <div className="text-[10px] text-white/30 mt-0.5">
                                    {new Date(redeemedAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short',
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleRedeem}
                            disabled={isRedeeming}
                            className="px-4 py-1.5 bg-white text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isRedeeming ? '...' : 'Usar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
