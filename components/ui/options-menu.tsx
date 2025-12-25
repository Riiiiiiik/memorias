'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Gift, Heart } from 'lucide-react';

interface OptionsMenuProps {
    onShowReason?: () => void;
}

export function OptionsMenu({ onShowReason }: OptionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Menu Button - Apple Glassmorphism Style */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full text-gray-100 text-[13px] font-medium transition-all duration-200 active:scale-95"
            >
                <span>Opções</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop to close menu */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Items - Refined Glass Panel */}
                    <div className="absolute top-10 left-0 z-50 w-52 bg-gray-800/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                        <div className="py-2">
                            {/* Cupons de Amor */}
                            <Link
                                href="/cupons"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                            >
                                <Gift className="w-5 h-5 text-pink-400" />
                                <span className="text-sm font-medium">Cupons de Amor</span>
                            </Link>

                            {/* Precisa de um motivo */}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onShowReason?.();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                            >
                                <Heart className="w-5 h-5 text-pink-400" />
                                <span className="text-sm font-medium">Precisa de um motivo?</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
