"use client";

import React from "react";
import { PageContent } from "@/components/page-content";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/ui/editable-text";

interface GalleryScreenProps {
    isActive: boolean;
    initialMemories: any[];
    content: any;
    hasRealMemories: boolean;
}

export function GalleryScreen({ isActive, initialMemories, content, hasRealMemories }: GalleryScreenProps) {
    return (
        <div className={cn("app-screen h-full w-full absolute top-0 left-0 overflow-y-auto overflow-x-hidden transition-opacity duration-300",
            isActive ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
        )}>


            <div className="relative z-10 pb-[100px]"> {/* Extra padding for bottom nav */}
                <PageContent
                    initialMemories={initialMemories}
                    content={content}
                    hasRealMemories={hasRealMemories}
                />

                {/* FOOTER - Moved inside scrolling container */}
                <footer className="relative py-12 text-center text-white/30 text-sm pb-8 max-w-5xl mx-auto">
                    <EditableText
                        contentKey="footer_text"
                        initialValue={content.footer_text || `Feito com todo o meu amor © ${new Date().getFullYear()}`}
                        as="p"
                    />
                </footer>
            </div>
        </div>
    );
}
