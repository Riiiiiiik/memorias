'use client';

import Link from 'next/link';
import { useState } from 'react';

export function CouponsButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href="/cupons"
            className="fixed bottom-6 left-6 z-50 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />

                {/* Button */}
                <div className="relative glass-panel px-6 py-4 rounded-full flex items-center gap-3 hover:scale-105 transition-transform">
                    <span className="text-2xl">🎁</span>
                    <span className="text-white font-semibold text-sm">
                        Cupons de Amor
                    </span>
                </div>
            </div>
        </Link>
    );
}
