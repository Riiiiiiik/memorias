"use client";

import React, { useState, useEffect } from "react";
import { ScratchCard } from "@/components/scratch-card";
import { LoveReasonButton } from "../love-reason-button";
import { Sparkles, ArrowRight } from "lucide-react";
import Confetti from "react-confetti";
import { cn } from "@/lib/utils";

interface HomeScreenProps {
    isActive: boolean;
    onNavigateToGallery: () => void;
}

export function HomeScreen({ isActive, onNavigateToGallery }: HomeScreenProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });

            // Debounce resize to prevent excessive re-renders
            let timeoutId: NodeJS.Timeout;
            const handleResize = () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
                }, 200);
            };

            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
                clearTimeout(timeoutId);
            };
        }
    }, []);

    const handleReveal = () => {
        setIsRevealed(true);
    };

    return (
        <div className={cn("app-screen flex flex-col items-center justify-center p-4 h-full w-full absolute top-0 left-0 transition-opacity duration-500",
            isActive ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
        )}>
            {/* Confetti optimized */}
            {isActive && isRevealed && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    <Confetti
                        width={windowDimensions.width}
                        height={windowDimensions.height}
                        recycle={false} // STOP after one burst
                        numberOfPieces={150} // Reduced from 200
                        gravity={0.15} // Slightly faster fall
                        colors={['#ff69b4', '#ff1493', '#ffd700', '#ffffff']}
                    />
                </div>
            )}



            <div className="z-10 text-center space-y-6 flex flex-col items-center w-full max-w-md">
                <div className="space-y-2">
                    <h1 className="text-4xl font-serif font-bold text-[#d81b60] drop-shadow-sm">
                        Sua Surpresa ❤️
                    </h1>
                    <p className="text-pink-400 font-medium">
                        {isRevealed ? "Aproveite seu presente!" : "Raspe abaixo para descobrir..."}
                    </p>
                </div>

                <div className="relative p-2 bg-white rounded-2xl shadow-xl transform transition-transform duration-500 hover:scale-[1.01]">
                    {/* Card Container */}
                    <div className="relative rounded-xl overflow-hidden w-[300px] h-[400px]">

                        {/* Secret Content */}
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

                        {/* Scratch Layer */}
                        <div className={cn("absolute inset-0 transition-opacity duration-1000", isRevealed ? "opacity-0 pointer-events-none" : "opacity-100")}>
                            {/* Only render ScratchCard if we haven't fully revealed it yet, or to keep it visible while scratching */}
                            <ScratchCard
                                width={300}
                                height={400}
                                coverColor="#ff80ab"
                                onRevealComplete={handleReveal}
                                revealThreshold={40}
                            />
                        </div>
                    </div>
                </div>

                {isRevealed && (
                    <div className="animate-bounce mt-8">
                        <button
                            onClick={onNavigateToGallery}
                            className="flex items-center gap-2 px-6 py-3 bg-[#d81b60] text-white rounded-full font-bold shadow-lg hover:bg-[#ad1457] transition-colors"
                        >
                            Ver Nossas Memórias <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Reason Button */}
            {isActive && <LoveReasonButton />}
        </div>
    );
}
