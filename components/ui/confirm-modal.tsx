'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isLoading = false
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/20 shadow-2xl bg-black/40 text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">{title}</h3>
                                {description && (
                                    <p className="text-white/60 text-sm">{description}</p>
                                )}
                            </div>

                            <div className="flex gap-3 w-full mt-4">
                                <button
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? '...' : confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
