'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Clock, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, based on other files, or I'll standard clsx/tailwind-merge

interface TimeCapsuleButtonProps {
    targetDate: string; // ISO string
    children: ReactNode;
    title?: string;
    description?: string;
}

export function TimeCapsuleButton({ targetDate, children, title = "Cápsula do Tempo", description = "Uma mensagem especial espera por você." }: TimeCapsuleButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(true);
    const [shake, setShake] = useState(0);
    const [timeMessage, setTimeMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const target = new Date(targetDate);

            if (now >= target) {
                setIsLocked(false);
            } else {
                setIsLocked(true);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [targetDate]);

    const handleClick = () => {
        if (!isLocked) {
            setIsOpen(true);
            return;
        }

        // Locked logic
        setShake(prev => prev + 1); // Trigger shake

        const now = new Date();
        const target = new Date(targetDate);
        const diff = target.getTime() - now.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        // Simple heuristic for message
        let msg = "";
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            msg = `Ainda não é dia! Espere mais ${days} dia${days > 1 ? 's' : ''}.`;
        } else if (hours > 0) {
            msg = `Ainda não é dia! Espere ${hours}h e ${minutes}min.`;
        } else {
            msg = `Quase lá! Espere apenas ${minutes} minuto${minutes !== 1 ? 's' : ''}!`;
        }

        setTimeMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <>
            <motion.button
                className="relative group flex flex-col items-center justify-center gap-2 p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all shadow-lg"
                onClick={handleClick}
                animate={isLocked ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }} // Only runs when key changes if we attach key, but here we trigger via state? Actually animate prop runs when values change.
                // Better way to trigger shake manually:
                key={shake} // Re-render to trigger animation if isLocked is set? No, that's heavy.
            // Let's use simpler variants or just controlled animation
            >
                {/* We'll use a separate motion div for the shake content to avoid re-mounting the button if possible, 
                    OR just accept the key method which is simple for one-off shakes */}

                <div className="relative p-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-colors">
                    {isLocked ? (
                        <Lock className="w-8 h-8 text-indigo-300" />
                    ) : (
                        <Mail className="w-8 h-8 text-pink-300 animate-pulse" />
                    )}

                    {/* Sparkles for unlocked */}
                    {!isLocked && (
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <Sparkles className="w-4 h-4 text-yellow-200" />
                        </motion.div>
                    )}
                </div>

                <div className="text-center">
                    <h3 className="text-white font-medium text-lg">{isLocked ? "Bloqueado" : title}</h3>
                    <p className="text-white/40 text-xs mt-1">{isLocked ? "Clique para ver quando abre" : "Toque para abrir agora"}</p>
                </div>

                {/* Toast Message for Locked State */}
                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 w-max max-w-[200px] md:max-w-xs bg-red-500/90 text-white text-xs md:text-sm px-4 py-2 rounded-xl shadow-xl pointer-events-none z-20 text-center"
                        >
                            {timeMessage}
                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500/90 rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Modal for Content */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="relative z-0">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-full bg-pink-500/20 text-pink-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif text-white">{title}</h2>
                                        <p className="text-white/40 text-sm">{description}</p>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none text-white/80 leading-relaxed font-light">
                                    {children}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
