import { createClient } from '@/lib/supabase/server';
import { CouponCard } from '@/components/coupons/coupon-card';
import PrismaticBurst from '@/components/ui/PrismaticBurst';
import Link from 'next/link';

export default async function CuponsPage() {
    const supabase = await createClient();

    const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching coupons:', error);
    }

    const availableCoupons = coupons?.filter(c => !c.is_redeemed) || [];
    const usedCoupons = coupons?.filter(c => c.is_redeemed) || [];

    return (
        <main className="relative min-h-screen bg-black">
            {/* Background */}
            <div className="fixed inset-0 -z-20">
                <PrismaticBurst
                    animationType="rotate3d"
                    intensity={2}
                    speed={0.5}
                    distort={1.0}
                    paused={false}
                    offset={{ x: 0, y: 0 }}
                    hoverDampness={0.25}
                    rayCount={24}
                    mixBlendMode="lighten"
                    colors={['#ff007a', '#4d3dff', '#ffffff']}
                />
            </div>

            {/* Content - Mobile Frame */}
            <div className="relative z-10 w-full max-w-[414px] mx-auto min-h-screen px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Voltar
                    </Link>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-serif font-bold text-white">
                            Cupons de Amor
                        </h1>
                        <p className="text-white/50 text-sm">
                            Presentes especiais só para você ❤️
                        </p>
                    </div>
                </div>

                {/* Available Coupons */}
                {availableCoupons.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                            Disponíveis ({availableCoupons.length})
                        </h2>
                        <div className="space-y-3">
                            {availableCoupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.id}
                                    id={coupon.id}
                                    title={coupon.title}
                                    description={coupon.description}
                                    emoji={coupon.emoji}
                                    isRedeemed={coupon.is_redeemed}
                                    redeemedAt={coupon.redeemed_at}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Used Coupons */}
                {usedCoupons.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                            Já Usados ({usedCoupons.length})
                        </h2>
                        <div className="space-y-3">
                            {usedCoupons.map((coupon) => (
                                <CouponCard
                                    key={coupon.id}
                                    id={coupon.id}
                                    title={coupon.title}
                                    description={coupon.description}
                                    emoji={coupon.emoji}
                                    isRedeemed={coupon.is_redeemed}
                                    redeemedAt={coupon.redeemed_at}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!coupons?.length && (
                    <div className="text-center text-white/40 py-12">
                        <div className="text-5xl mb-4">🎟️</div>
                        <p>Nenhum cupom disponível.</p>
                        <p className="text-sm mt-2">Adicione cupons no Supabase!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
