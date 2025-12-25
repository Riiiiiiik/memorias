'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface LivingCounterProps {
    startDate: string; // ISO date string
}

export function LivingCounter({ startDate }: LivingCounterProps) {
    const [stats, setStats] = useState({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        moons: 0,
        seasons: 0,
        heartbeats: 0,
    });

    useEffect(() => {
        const start = new Date(startDate);

        const updateStats = () => {
            const now = new Date();
            const diff = now.getTime() - start.getTime();

            // Basic Time Units
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            // Romantic Stats
            // Lua cheia a cada ~29.53 dias
            const moons = (days / 29.53).toFixed(1);

            // Batimentos: média de 80 bpm
            // 80 batimentos * minutos vividos
            const heartbeats = (minutes * 80).toLocaleString('pt-BR');

            // Estações: ~91.25 dias por estação
            const seasons = Math.floor(days / 91.25);

            // Years/Months/Days calculation for display
            let y = now.getFullYear() - start.getFullYear();
            let m = now.getMonth() - start.getMonth();
            let d = now.getDate() - start.getDate();

            if (d < 0) {
                m--;
                const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                d += lastMonth.getDate();
            }
            if (m < 0) {
                y--;
                m += 12;
            }

            setStats({
                years: y,
                months: m,
                days: d,
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds(),
                moons: Number(moons),
                seasons,
                heartbeats: Number(heartbeats.replace(/\./g, '')), // Keep number for now
            });
        };

        const timer = setInterval(updateStats, 1000);
        updateStats();

        return () => clearInterval(timer);
    }, [startDate]);

    return (
        <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
            {/* Header with Main Counter */}
            <div className="text-center space-y-2">
                <h3 className="text-white/60 text-sm font-medium uppercase tracking-widest">
                    Tempo de Nós
                </h3>
                <div className="flex flex-wrap justify-center gap-3 text-white font-serif">
                    <span className="text-2xl md:text-3xl">
                        {stats.years}<span className="text-base text-white/40 ml-1">anos</span>
                    </span>
                    <span className="text-2xl md:text-3xl">
                        {stats.months}<span className="text-base text-white/40 ml-1">meses</span>
                    </span>
                    <span className="text-2xl md:text-3xl">
                        {stats.days}<span className="text-base text-white/40 ml-1">dias</span>
                    </span>
                </div>
            </div>

            {/* Central Pulsing Heart */}
            <div className="flex justify-center my-8">
                <div className="relative">
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 bg-pink-500/30 rounded-full animate-ping opacity-75" />
                    <div className="relative bg-gradient-to-br from-pink-500 to-rose-600 p-4 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-pulse-heart">
                        <Heart className="w-8 h-8 text-white fill-white" />
                    </div>
                </div>
            </div>

            {/* Romantic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {/* Heartbeats */}
                <div className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="text-pink-400 mb-2 group-hover:scale-110 transition-transform duration-300">❤️</div>
                    <div className="text-xl font-bold text-white mb-1">
                        {stats.heartbeats.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-white/50">
                        Batimentos compartilhados
                    </div>
                </div>

                {/* Moons */}
                <div className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-300">🌕</div>
                    <div className="text-xl font-bold text-white mb-1">
                        {stats.moons}
                    </div>
                    <div className="text-xs text-white/50">
                        Luas cheias juntos
                    </div>
                </div>

                {/* Seasons */}
                <div className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="text-amber-400 mb-2 group-hover:scale-110 transition-transform duration-300">🍂</div>
                    <div className="text-xl font-bold text-white mb-1">
                        {stats.seasons}
                    </div>
                    <div className="text-xs text-white/50">
                        Estações vividas
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-white/30 italic mt-4">
                *Cálculo aproximado baseado em 80 bpm.
            </p>
        </div>
    );
}
