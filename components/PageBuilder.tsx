"use client";

import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { StackCarousel } from "@/components/carousel/stack";
import { Memory } from "@/components/carousel/memory-card";
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface PageBuilderProps {
    memories: Memory[];
}

interface EditableText {
    heroTitle: string;
    heroSubtitle: string;
    dedicationTitle: string;
    dedicationBody1: string;
    dedicationBody2: string;
    soundtrackTitle: string;
    timelineTitle: string;
    footerText: string;
    youtubeId: string;
}

const SECTION_IDS = ['hero', 'dedication', 'soundtrack', 'timeline'];

const AutoTextarea = ({ value, onChange, className, placeholder }: { value: string, onChange: (e: any) => void, className?: string, placeholder?: string }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => {
                onChange(e);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onFocus={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder={placeholder}
            rows={1}
            className={cn("overflow-hidden", className)}
            style={{ minHeight: '1.5em' }}
        />
    );
};

export default function PageBuilder({ memories }: PageBuilderProps) {
    // Helper to extract YouTube ID
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url; // Return existing ID if no match (assuming user pasted ID)
    };

    // Content State
    const [texts, setTexts] = useState<EditableText>({
        heroTitle: 'Nossas Memórias',
        heroSubtitle: 'Arraste para relembrar',
        dedicationTitle: 'Para o meu amor,',
        dedicationBody1: 'Criei este cantinho digital para guardarmos os momentos que fizeram nosso mundo parar.',
        dedicationBody2: 'Cada foto aqui é um capítulo da nossa história favorita. Que possamos continuar escrevendo (e fotografando) muitos outros momentos juntos.',
        soundtrackTitle: 'Nossa Trilha Sonora',
        timelineTitle: 'Nossa Linha do Tempo',
        footerText: 'Feito com todo o meu amor © ' + new Date().getFullYear(),
        youtubeId: 'niyFj9UQPMk'
    });

    // Order State
    const [order, setOrder] = useState(SECTION_IDS);

    // Output Config for User
    const handleExport = () => {
        const config = {
            texts,
            order
        };
        console.log("COPY THIS CONFIG:", JSON.stringify(config, null, 2));
        alert("Configuração copiada para o Console (F12)!\nCopie e mande para o dev fixar o site.");
    };

    // Helper to update text
    const updateText = (key: keyof typeof texts, value: string) => {
        setTexts(prev => ({ ...prev, [key]: value }));
    };

    // Components for each section
    const sections: Record<string, React.ReactNode> = {
        hero: (
            <section className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-8">
                    <div className="space-y-2 mb-8 group relative rounded-xl border border-transparent hover:border-white/10 p-2 transition-colors">
                        <AutoTextarea
                            value={texts.heroTitle}
                            onChange={(e) => updateText('heroTitle', e.target.value)}
                            className="bg-transparent text-4xl font-serif font-bold tracking-tight text-white/90 drop-shadow-lg text-center w-full outline-none placeholder-white/30 resize-none"
                        />
                        <AutoTextarea
                            value={texts.heroSubtitle}
                            onChange={(e) => updateText('heroSubtitle', e.target.value)}
                            className="bg-transparent text-white/60 text-sm font-light tracking-wide italic text-center w-full outline-none placeholder-white/30 resize-none"
                        />
                    </div>

                    {/* Carousel (Not editable content, just display) */}
                    <div className="relative h-[450px] w-full flex items-center justify-center pointer-events-none">
                        <StackCarousel memories={memories} />
                    </div>
                </div>
            </section>
        ),
        dedication: (
            <section className="py-12 px-6 flex justify-center">
                <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-6 group border border-transparent hover:border-white/10 transition-all">
                    <AutoTextarea
                        value={texts.dedicationTitle}
                        onChange={(e) => updateText('dedicationTitle', e.target.value)}
                        className="bg-transparent text-3xl font-serif text-white/90 text-center w-full outline-none resize-none"
                    />
                    <div className="space-y-4 text-white/80 leading-relaxed font-light flex flex-col items-center">
                        <AutoTextarea
                            value={texts.dedicationBody1}
                            onChange={(e) => updateText('dedicationBody1', e.target.value)}
                            className="bg-transparent w-full text-center outline-none resize-none"
                        />
                        <AutoTextarea
                            value={texts.dedicationBody2}
                            onChange={(e) => updateText('dedicationBody2', e.target.value)}
                            className="bg-transparent w-full text-center outline-none resize-none"
                        />
                    </div>
                    <div className="pt-4">
                        <span className="text-4xl">❤️</span>
                    </div>
                </div>
            </section>
        ),
        soundtrack: (
            <section className="py-12 px-6 flex flex-col items-center text-center space-y-8 group border border-transparent hover:border-white/10 rounded-xl">
                <AutoTextarea
                    value={texts.soundtrackTitle}
                    onChange={(e) => updateText('soundtrackTitle', e.target.value)}
                    className="bg-transparent text-2xl font-serif text-white/90 tracking-wide text-center w-full outline-none resize-none"
                />

                {/* YouTube Edit Input */}
                <input
                    placeholder="Cole o link do YouTube aqui..."
                    className="bg-white/10 text-white text-xs p-2 rounded w-full text-center outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                    onChange={(e) => {
                        const id = getYoutubeId(e.target.value);
                        if (id) updateText('youtubeId', id);
                    }}
                />

                <div className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden glass-card p-1 pointer-events-none opacity-80 aspect-video bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${texts.youtubeId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="rounded-lg"
                    ></iframe>
                </div>
            </section>
        ),
        timeline: (
            <section className="py-12 px-6 max-w-md mx-auto group border border-transparent hover:border-white/10 rounded-xl">
                <input
                    value={texts.timelineTitle}
                    onChange={(e) => updateText('timelineTitle', e.target.value)}
                    className="bg-transparent text-2xl font-serif text-white/90 text-center mb-12 tracking-wide w-full outline-none"
                />

                <div className="relative border-l-2 border-white/20 ml-6 space-y-12 pb-12 opacity-80 pointer-events-none">
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-pink-500 border-4 border-[#0f172a]" />
                        <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">O Início</span>
                        <h3 className="text-xl text-white mt-1">Onde tudo começou</h3>
                    </div>
                    <div className="relative pl-8">
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-purple-500 border-4 border-[#0f172a]" />
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Hoje</span>
                        <h3 className="text-xl text-white mt-1">E contando...</h3>
                    </div>
                </div>
                <p className="text-xs text-center text-slate-500 mt-4">(Edição da timeline em breve)</p>
            </section>
        )
    };

    return (
        <div className="pb-20">
            <Reorder.Group axis="y" values={order} onReorder={setOrder}>
                {order.map((item) => (
                    <Reorder.Item key={item} value={item} className="relative cursor-move">

                        {/* Drag Handle Indicator (Visible on Hover/Active) */}
                        <div className="absolute top-2 right-2 p-2 bg-white/10 rounded-full opacity-0 hover:opacity-100 z-50 text-white cursor-grab active:cursor-grabbing transition-opacity">
                            <GripVertical size={20} />
                        </div>

                        {sections[item]}
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Footer Editable */}
            <footer className="py-12 text-center text-white/30 text-sm relative z-10 pb-20 group">
                <input
                    value={texts.footerText}
                    onChange={(e) => updateText('footerText', e.target.value)}
                    className="bg-transparent w-full text-center outline-none"
                    title="Editar rodapé"
                />
            </footer>

            {/* Save Config Button (Visible only in dev/edit mode) */}
            <div className="fixed bottom-4 right-4 z-[100]">
                <button
                    onClick={handleExport}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                    💾 Salvar Config
                </button>
            </div>
        </div>
    );
}
