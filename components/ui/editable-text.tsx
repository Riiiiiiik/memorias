'use client';

import { useState, useRef, useEffect } from 'react';
import { updateSiteContent } from '@/app/actions/content';

interface EditableTextProps {
    initialValue: string;
    contentKey: string; // Key for database persistence
    className?: string;
    as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
    placeholder?: string;
}

export function EditableText({
    initialValue,
    contentKey,
    className = '',
    as: Component = 'p',
    placeholder = 'Clique para editar...'
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // Don't select all for better UX on mobile? Or maybe yes.
            // inputRef.current.select(); 
        }
    }, [isEditing]);

    const handleSave = async () => {
        setIsEditing(false);
        if (value !== initialValue) {
            setIsSaving(true);
            try {
                await updateSiteContent(contentKey, value);
                console.log('Saved:', contentKey);
            } catch (error) {
                console.error('Failed to save:', error);
                alert('Falha ao salvar alteração. Tente novamente.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setValue(initialValue);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="relative w-full">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-white/10 border border-white/30 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 text-white ${className}`}
                    rows={3}
                    placeholder={placeholder}
                />
                <div className="absolute -bottom-6 right-0 text-xs text-white/40">
                    Enter = salvar | Esc = cancelar
                </div>
            </div>
        );
    }

    return (
        <Component
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer hover:bg-white/5 hover:outline hover:outline-1 hover:outline-dashed hover:outline-white/30 rounded-lg transition-all p-1 -m-1 relative ${className} ${isSaving ? 'opacity-50' : ''}`}
            title="Clique para editar"
        >
            {value || placeholder}
            {isSaving && <span className="absolute -right-4 top-0 text-xs text-yellow-500">💾</span>}
        </Component>
    );
}
