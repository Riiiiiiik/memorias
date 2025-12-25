'use client';

import React, { useState, useEffect } from 'react';
import { Memory } from "@/components/carousel/memory-card";
import { StackCarousel } from "@/components/carousel/stack";
import { EditableText } from "@/components/ui/editable-text";
import { YouTubePlayer } from "@/components/youtube-player";
import { OptionsMenuWithReason } from "@/components/ui/options-menu-with-reason";

interface PageContentProps {
    initialMemories: Memory[];
    content: Record<string, string>;
    hasRealMemories: boolean;
}

const SECTION_ORDER = ['hero', 'dedication', 'soundtrack', 'timeline'];

export function PageContent({ initialMemories, content, hasRealMemories }: PageContentProps) {
    const [timelineSpacing, setTimelineSpacing] = useState(3);

    // Load saved spacing from localStorage (keeping this as it might be useful preference)
    useEffect(() => {
        const savedSpacing = localStorage.getItem('timeline-spacing');
        if (savedSpacing) {
            setTimelineSpacing(parseInt(savedSpacing));
        }
    }, []);

    const sections: Record<string, React.JSX.Element> = {
        hero: (
            <section key="hero" className="min-h-screen flex flex-col items-center justify-center p-3 relative">
                {/* Options Menu - Absolute Top Left */}
                <div className="absolute top-4 left-4 z-[150]">
                    <OptionsMenuWithReason />
                </div>

                <div className="w-full max-w-md text-center space-y-8">
                    <div className="space-y-2 mb-8 z-20 relative">
                        <EditableText
                            contentKey="home_title"
                            initialValue={content.home_title || "Nossas Memórias"}
                            as="h1"
                            className="text-4xl font-serif font-bold tracking-tight text-white/90 drop-shadow-lg"
                        />
                        <EditableText
                            contentKey="home_subtitle"
                            initialValue={content.home_subtitle || "Arraste para relembrar"}
                            as="p"
                            className="text-white/60 text-sm font-light tracking-wide italic"
                        />
                    </div>

                    <div className="relative h-[450px] w-full flex items-center justify-center">
                        <StackCarousel memories={initialMemories} />
                    </div>

                    <div className="flex flex-col items-center gap-2 mt-8">
                        {!hasRealMemories && (
                            <p className="text-xs text-white/20">
                                Modo Demo (Conecte o Supabase para ver dados reais)
                            </p>
                        )}
                        <div className="animate-bounce mt-4 text-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>
        ),
        dedication: (
            <section key="dedication" className="py-12 px-4 flex justify-center">
                <div className="letter-container p-8 rounded-3xl max-w-2xl w-full space-y-8 transform transition-all duration-700 hover:scale-[1.01]">
                    {/* Date Header */}
                    <div className="text-right">
                        <EditableText
                            contentKey="letter_date"
                            initialValue={content.letter_date || "Natal, 2025"}
                            as="span"
                            className="text-xs text-white/40 font-serif-letter tracking-wide"
                        />
                    </div>

                    {/* Salutation - Handwriting Font */}
                    <EditableText
                        contentKey="dedication_title"
                        initialValue={content.dedication_title || "Para o meu amor,"}
                        as="h2"
                        className="text-4xl font-handwriting text-pink-400 text-left"
                    />

                    {/* Body - Serif, Left-aligned Paragraphs */}
                    <div className="space-y-6 font-serif-letter text-white/85 leading-relaxed text-left text-lg">
                        <EditableText
                            contentKey="dedication_p1"
                            initialValue={content.dedication_p1 || "Criei este cantinho digital pensando em nós. Deu trabalho, mas é daqueles que faço com o coração, só para te ver sorrir."}
                            as="p"
                        />
                        <EditableText
                            contentKey="dedication_p2"
                            initialValue={content.dedication_p2 || "É o nosso primeiro Natal junto, e o primeiro de tantos que ainda virão. Quero muitos, por bilhões de anos ao teu lado."}
                            as="p"
                        />
                        <EditableText
                            contentKey="dedication_p3"
                            initialValue={content.dedication_p3 || "Te amo, e amo quando você se dedica a me entender, quando se esforça para que a gente se encaixe melhor um no outro. Amo as nossas loucuras e tudo em você."}
                            as="p"
                        />

                        {/* Blockquote for Emphasis */}
                        <blockquote className="letter-blockquote text-white/70 text-base my-8 pl-6 border-l-4 border-pink-500/30">
                            <EditableText
                                contentKey="dedication_quote"
                                initialValue={content.dedication_quote || "\"Quero que saiba que sempre poderá contar comigo... porque eu também sempre vou precisar de você.\""}
                                as="p"
                            />
                        </blockquote>
                    </div>

                    {/* Signature */}
                    <div className="text-right pt-6">
                        <p className="text-sm text-white/50 font-serif-letter">Com todo meu amor,</p>
                        <EditableText
                            contentKey="signature"
                            initialValue={content.signature || "Seu Amor ♡"}
                            as="p"
                            className="text-3xl font-handwriting text-pink-400 mt-2"
                        />
                    </div>

                    {/* Heart Decoration */}
                    <div className="flex justify-center pt-4">
                        <span className="animate-heartbeat text-4xl">❤️</span>
                    </div>
                </div>
            </section>
        ),
        soundtrack: (
            <section key="soundtrack" className="py-12 px-3 flex flex-col items-center text-center space-y-12">
                <h2 className="text-3xl font-serif text-white/90 tracking-wide">Nossa Trilha Sonora</h2>
                <div className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden glass-card p-1">
                    <YouTubePlayer videoId="niyFj9UQPMk" />
                </div>
            </section>
        ),
        timeline: (
            <section key="timeline" className="py-12 px-3 max-w-2xl mx-auto w-full">
                <h2 className="text-3xl font-serif text-white/90 text-center mb-16 tracking-wide">Nossa Linha do Tempo</h2>
                <div className="relative border-l-2 border-white/20 ml-6 pb-12" style={{ display: 'flex', flexDirection: 'column', gap: `${timelineSpacing * 4}px` }}>
                    <div className="relative pl-10">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-pink-500 border-4 border-[#0f172a]" />
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">O Início</span>
                        <h3 className="text-xl text-white mt-1">Onde tudo começou</h3>
                        <p className="text-white/60 text-sm mt-2">
                            O dia em que nossos caminhos se cruzaram e tudo mudou.
                        </p>
                    </div>

                    <div className="relative pl-10">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-purple-500 border-4 border-[#0f172a]" />
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Primeira Viagem</span>
                        <h3 className="text-xl text-white mt-1">Nossa Aventura</h3>
                        <p className="text-white/60 text-sm mt-2">
                            Descobrindo novos lugares e criando memórias inesquecíveis.
                        </p>
                    </div>

                    <div className="relative pl-10">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-indigo-500 border-4 border-[#0f172a]" />
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Hoje</span>
                        <h3 className="text-xl text-white mt-1">E contando...</h3>
                        <p className="text-white/60 text-sm mt-2">
                            Cada dia ao seu lado é um novo presente.
                        </p>
                    </div>
                </div>
            </section>
        ),
    };

    const orderedSections = SECTION_ORDER.map(id => sections[id]).filter(Boolean);

    return (
        <div className="relative z-10 w-full max-w-5xl mx-auto min-h-screen">
            {orderedSections}
        </div>
    );
}
