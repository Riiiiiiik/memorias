'use client';

import { useState, useEffect } from 'react';
import { Edit3, Lock } from 'lucide-react';

interface EditModeToggleProps {
    isEditMode: boolean;
    onToggle: (enabled: boolean) => void;
}

export function EditModeToggle({ isEditMode, onToggle }: EditModeToggleProps) {
    return (
        <button
            onClick={() => onToggle(!isEditMode)}
            className={`fixed top-4 right-4 z-[200] px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 shadow-2xl transition-all ${isEditMode
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20'
                }`}
            title={isEditMode ? 'Congelar Layout' : 'Modo Editor'}
        >
            {isEditMode ? (
                <>
                    <Lock className="w-4 h-4" />
                    Congelar
                </>
            ) : (
                <>
                    <Edit3 className="w-4 h-4" />
                    Editar
                </>
            )}
        </button>
    );
}
