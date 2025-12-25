'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';

type Reason = {
    id: string;
    texto: string;
};

// Fallback reasons if DB is empty or fails
const FALLBACK_REASONS = [
    "Porque você faz o melhor café.",
    "Pelo jeito que você ri dos meus bugs no código.",
    "Porque você me apoia nos meus projetos.",
    "Porque cada dia com você é um presente.",
    "Pela sua risada que ilumina tudo."
];

export function LoveReasonButton() {
    const [reasons, setReasons] = useState<string[]>([]);
    const [currentReason, setCurrentReason] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        async function fetchReasons() {
            const { data, error } = await supabase
                .from('motivos')
                .select('texto');

            if (error || !data || data.length === 0) {
                console.log('Using fallback reasons');
                setReasons(FALLBACK_REASONS);
            } else {
                setReasons(data.map(r => r.texto));
            }
        }

        fetchReasons();
    }, [supabase]);

    const showReason = () => {
        setIsLoading(true);
        // Simulate a tiny delay for effect
        setTimeout(() => {
            let nextReason = currentReason;

            // Ensure we don't repeat the immediate last one if we have enough options
            if (reasons.length > 1) {
                do {
                    const randomIndex = Math.floor(Math.random() * reasons.length);
                    nextReason = reasons[randomIndex];
                } while (nextReason === currentReason);
            } else {
                nextReason = reasons[0];
            }

            setCurrentReason(nextReason);
            setIsOpen(true);
            setIsLoading(false);
        }, 300);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full shadow-2xl transition-all"
                onClick={showReason}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <span className="text-white/90 text-sm font-medium tracking-wide">Precisa de um motivo?</span>
                <div className="relative">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500/20 group-hover:scale-110 transition-transform" />
                    <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Sparkles className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                </div>
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Card */}
                        <motion.div
                            className="relative w-full max-w-lg glass-panel p-8 md:p-12 rounded-3xl text-center border border-white/20 shadow-2xl bg-black/20"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6 flex justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                                </motion.div>
                            </div>

                            <motion.h3
                                className="text-2xl md:text-3xl font-serif text-white leading-relaxed"
                                key={currentReason} // Re-animate when text changes
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                &quot;{currentReason}&quot;
                            </motion.h3>

                            <div className="mt-8 flex justify-center gap-4">
                                <motion.button
                                    className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors border border-white/10"
                                    onClick={showReason}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Ver outro motivo
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
