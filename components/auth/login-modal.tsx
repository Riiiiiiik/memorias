'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, LogIn } from 'lucide-react';
import { login } from '@/app/auth/actions';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    canClose?: boolean;
}

export function LoginModal({ isOpen, onClose, canClose = true }: LoginModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            // Redirect happens on server
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className={`absolute inset-0 bg-black/60 backdrop-blur-md ${canClose ? 'cursor-pointer' : ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={canClose ? onClose : undefined}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/20 shadow-2xl bg-black/40"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {canClose && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <div className="flex flex-col items-center mb-6">
                            <div className="p-3 bg-indigo-500/20 rounded-full mb-4 ring-1 ring-inset ring-indigo-500/50">
                                <LogIn className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-serif text-white">Acesso Admin</h2>
                            <p className="text-white/40 text-sm mt-2">Área restrita para gerenciar memórias.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                    placeholder="admin@exemplo.com"
                                />
                            </div>

                            <div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-xs text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Entrar'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
