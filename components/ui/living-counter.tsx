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
        milliseconds: 0,
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
            const secondsTotal = Math.floor(diff / 1000);
            const minutesTotal = Math.floor(secondsTotal / 60);

            const moons = (diff / (1000 * 60 * 60 * 24 * 29.53)).toFixed(1);
            const heartbeats = (minutesTotal * 80).toLocaleString('pt-BR');
            const seasons = Math.floor(diff / (1000 * 60 * 60 * 24 * 91.25));

            let y = now.getFullYear() - start.getFullYear();
            let m = now.getMonth() - start.getMonth();
            let d = now.getDate() - start.getDate();
            let h = now.getHours() - start.getHours();
            let min = now.getMinutes() - start.getMinutes();
            let s = now.getSeconds() - start.getSeconds();
            let ms = now.getMilliseconds() - start.getMilliseconds();

            if (ms < 0) {
                s--;
                ms += 1000;
            }
            if (s < 0) {
                min--;
                s += 60;
            }
            if (min < 0) {
                h--;
                min += 60;
            }
            if (h < 0) {
                d--;
                h += 24;
            }
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
                hours: h,
                minutes: min,
                seconds: s,
                milliseconds: ms,
                moons: Number(moons),
                seasons,
                heartbeats: Number(heartbeats.replace(/\./g, '')),
            });
        };

        const timer = setInterval(updateStats, 41); // ~24fps update for smooth milliseconds
        updateStats();

        return () => clearInterval(timer);
    }, [startDate]);

    // Format numbers
    const formattedHours = stats.hours.toString().padStart(2, '0');
    const formattedMinutes = stats.minutes.toString().padStart(2, '0');
    const formattedSeconds = stats.seconds.toString().padStart(2, '0');
    const formattedMs = stats.milliseconds.toString().padStart(3, '0');

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center space-y-12 py-8 relative">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none" />

            {/* Main Time Counter */}
            <div className="relative z-10 text-center space-y-4">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white/50 text-xs md:text-sm font-medium uppercase tracking-[0.3em]"
                >
                    Tempo de Nós
                </motion.h3>

                <div className="flex flex-wrap justify-center items-baseline gap-4 md:gap-8 font-serif text-white drop-shadow-2xl">
                    {/* Years */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {stats.years}
                        </span>
                        <span className="text-[10px] md:text-xs text-white/40 font-sans tracking-widest mt-2">ANOS</span>
                    </div>
                    {/* Months */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {stats.months}
                        </span>
                        <span className="text-[10px] md:text-xs text-white/40 font-sans tracking-widest mt-2">MESES</span>
                    </div>
                    {/* Days */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {stats.days}
                        </span>
                        <span className="text-[10px] md:text-xs text-white/40 font-sans tracking-widest mt-2">DIAS</span>
                    </div>

                    {/* Divider for smaller units */}
                    <div className="hidden lg:block w-px h-16 bg-white/10 mx-2"></div>

                    {/* Hours */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {formattedHours}
                        </span>
                        <span className="text-[10px] md:text-xs text-white/40 font-sans tracking-widest mt-2">HORAS</span>
                    </div>
                    {/* Minutes */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {formattedMinutes}
                        </span>
                        <span className="text-[10px] md:text-xs text-white/40 font-sans tracking-widest mt-2">MINUTOS</span>
                    </div>
                    {/* Seconds */}
                    <div className="flex flex-col items-center">
                        <span className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            {formattedSeconds}
                        </span>
                        <span className="text-[10px] md:text-xs text-white/40 font-sans tracking-widest mt-2">SEGUNDOS</span>
                    </div>

                    {/* Milliseconds */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl md:text-4xl font-bold text-pink-400/80 font-mono mt-2 md:mt-4">
                            .{formattedMs}
                        </span>
                        <span className="text-[10px] md:text-xs text-pink-400/40 font-sans tracking-widest mt-2">MS</span>
                    </div>
                </div>
            </div>

            {/* Realistic Heartbeat */}
            <div className="relative z-10 py-4">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1, 1.15, 1],
                    }}
                    transition={{
                        duration: 1.2, // ~50bpm resting rate feel, realistic pattern
                        repeat: Infinity,
                        times: [0, 0.15, 0.3, 0.45, 1], // The "lub-dub" rhythm
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-rose-500 blur-xl opacity-40 rounded-full scale-150" />

                    <div className="relative bg-gradient-to-br from-rose-500 to-pink-600 p-6 rounded-full shadow-2xl border border-white/10 flex items-center justify-center">
                        <Heart className="w-10 h-10 md:w-12 md:h-12 text-white fill-white drop-shadow-lg" />
                    </div>
                </motion.div>

                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-6 text-center"
                >
                    <span className="text-[10px] uppercase tracking-widest text-rose-300/60 block">
                        Vivo e Pulsante
                    </span>
                </motion.div>
            </div>

            {/* Cinematic Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl px-4 relative z-10">
                <StatCard
                    emoji="❤️"
                    value={stats.heartbeats.toLocaleString('pt-BR')}
                    label="Batimentos"
                    sublabel="Corações sintonizados"
                    delay={0.1}
                />
                <StatCard
                    emoji="🌕"
                    value={stats.moons}
                    label="Luas Cheias"
                    sublabel="Noites iluminadas"
                    delay={0.2}
                />
                <StatCard
                    emoji="🍂"
                    value={stats.seasons.toString()}
                    label="Estações"
                    sublabel="Ciclos vividos"
                    delay={0.3}
                />
            </div>
        </div>
    );
}

function StatCard({ emoji, value, label, sublabel, delay }: { emoji: string, value: string | number, label: string, sublabel: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="group relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-100 rounded-2xl border border-white/5 transition-all duration-500 group-hover:border-white/10 group-hover:bg-white/10" />

            <div className="relative p-5 text-center flex flex-col items-center gap-1">
                <span className="text-2xl mb-1 filter grayscale group-hover:grayscale-0 transition-all duration-500">{emoji}</span>
                <span className="text-2xl font-bold text-white font-serif tracking-tight">{value}</span>
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{label}</span>
                <span className="text-[10px] text-white/30 font-light">{sublabel}</span>
            </div>
        </motion.div>
    );
}
