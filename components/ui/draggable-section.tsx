'use client';

import { Reorder } from 'framer-motion';
import { ReactNode } from 'react';

interface DraggableSectionProps {
    children: ReactNode;
    id: string;
    isEditMode: boolean;
    className?: string;
}

export function DraggableSection({ children, id, isEditMode, className = '' }: DraggableSectionProps) {
    if (!isEditMode) {
        return <div className={className}>{children}</div>;
    }

    return (
        <Reorder.Item
            value={id}
            id={id}
            className={`${className} ${isEditMode ? 'cursor-move border-2 border-dashed border-pink-500/50 relative' : ''}`}
        >
            {isEditMode && (
                <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold z-50">
                    ⋮⋮ Arraste para mover
                </div>
            )}
            {children}
        </Reorder.Item>
    );
}
