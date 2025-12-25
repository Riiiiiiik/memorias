'use client';

import React, { useState } from 'react';
import { ScratchCard } from '@/components/scratch-card';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';

export default function RaspadinhaPage() {
    const [isRevealed, setIsRevealed] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

    React.useEffect(() => {
        setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleReveal = () => {
        setIsRevealed(true);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">

            {/* Confetes ao Revelar */}
            {isRevealed && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    <Confetti
                        width={windowDimensions.width}
                        height={windowDimensions.height}
                        recycle={true}
                        numberOfPieces={200}
                        colors={['#ff69b4', '#ff1493', '#ffd700', '#ffffff']}
                    />
                </div>
            )}

            {/* Botão Voltar */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/">
                    <button className="bg-white/50 backdrop-blur-sm p-3 rounded-full hover:bg-white/80 transition-all text-pink-600">
                        <ArrowLeft size={24} />
                    </button>
                </Link>
            </div>

            <div className="z-10 text-center space-y-6 flex flex-col items-center px-4">

                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-[#d81b60] drop-shadow-sm">
                        Sua Surpresa ❤️
                    </h1>
                    <p className="text-pink-400 font-medium">
                        {isRevealed ? "Aproveite seu presente!" : "Raspe abaixo para descobrir..."}
                    </p>
                </div>

                <div className="relative p-2 bg-white rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-[1.01]">

                    {/* O Cartão de Raspar */}
                    <div className="relative rounded-xl overflow-hidden" style={{ width: 300, height: 400 }}>

                        {/* O CONTEÚDO SECRETO (Fica por baixo) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                            <Sparkles className="text-yellow-400 w-12 h-12 animate-pulse" />

                            <h2 className="text-3xl font-bold text-pink-600 font-serif leading-tight">
                                VALE<br />COCEGUINHAS
                            </h2>

                            <p className="text-sm text-gray-500 italic">
                                Válido por tempo indeterminado.<br />
                                (Sujeito a disponibilidade do doador 🥰)
                            </p>
                        </div>

                        {/* Camada de Raspadinha (Fica por cima) */}
                        <div className={`absolute inset-0 transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <ScratchCard
                                width={300}
                                height={400}
                                coverColor="silver" // Usar 'silver' para ativar o efeito realista
                                onRevealComplete={handleReveal}
                                revealThreshold={40}
                            />
                        </div>
                    </div>
                </div>

                {isRevealed && (
                    <div className="animate-bounce mt-8">
                        <p className="text-[#d81b60] font-bold text-lg">Te amo muito! 💖</p>
                    </div>
                )}

            </div>
        </main>
    );
}
