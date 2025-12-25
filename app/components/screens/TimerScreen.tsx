"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Heart, Moon, CloudSun, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface TimerScreenProps {
    isActive: boolean;
}

// CONFIG: Data de início (09 de Junho de 2025)
const START_DATE = new Date(2025, 5, 9);

export function TimerScreen({ isActive }: TimerScreenProps) {
    const [time, setTime] = useState({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        totalDays: 0
    });

    useEffect(() => {
        if (!isActive) return;

        const calculateTime = () => {
            const now = new Date();
            const start = new Date(START_DATE);
            const diff = now.getTime() - start.getTime();

            // Cálculos básicos
            let years = now.getFullYear() - start.getFullYear();
            let months = now.getMonth() - start.getMonth();
            let days = now.getDate() - start.getDate();
            let hours = now.getHours() - start.getHours();
            let minutes = now.getMinutes() - start.getMinutes();
            let seconds = now.getSeconds() - start.getSeconds();
            let milliseconds = now.getMilliseconds() - start.getMilliseconds();

            // Ajustes de tempo negativo
            if (milliseconds < 0) {
                milliseconds += 1000;
                seconds--;
            }
            if (seconds < 0) {
                seconds += 60;
                minutes--;
            }
            if (minutes < 0) {
                minutes += 60;
                hours--;
            }
            if (hours < 0) {
                hours += 24;
                days--;
            }
            if (days < 0) {
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
                months--;
            }
            if (months < 0) {
                months += 12;
                years--;
            }

            // Dias totais para cálculos extras (batimentos, luas, etc)
            const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

            setTime({ years, months, days, hours, minutes, seconds, milliseconds, totalDays });
        };

        // Atualização rápida para milissegundos
        const interval = setInterval(calculateTime, 47); // ~20fps para não pesar tanto quanto 60fps
        calculateTime();

        return () => clearInterval(interval);
    }, [isActive]);

    // Estatísticas calculadas
    const stats = {
        heartbeats: (time.totalDays * 115200).toLocaleString('pt-BR'), // ~80 bpm
        fullMoons: (time.totalDays / 29.53).toFixed(1),
        seasons: Math.floor(time.totalDays / 91.25)
    };

    return (
        <div className={cn("app-screen flex flex-col items-center justify-between h-full w-full absolute top-0 left-0 transition-opacity duration-300 overflow-y-auto pb-24 pt-10",
            isActive ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
        )}>

            {/* Timeline Section */}
            <div className="w-full px-6 mb-12 mt-4 relative">
                <h1 className="text-3xl font-serif text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Nossa Linha do Tempo
                </h1>

                <div className="relative pl-4 border-l border-white/10 space-y-10 ml-2">
                    {/* Event 1: O Início */}
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#d81b60] shadow-[0_0_10px_#d81b60]"></div>
                        <span className="text-[#d81b60] text-[10px] font-bold tracking-widest uppercase mb-1 block">O Início</span>
                        <h3 className="text-white text-lg font-bold mb-1">Onde tudo começou</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            O dia em que nossos caminhos se cruzaram e tudo mudou.
                        </p>
                    </div>

                    {/* Event 2: Primeira Viagem */}
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#a855f7] shadow-[0_0_10px_#a855f7]"></div>
                        <span className="text-[#a855f7] text-[10px] font-bold tracking-widest uppercase mb-1 block">Primeira Viagem</span>
                        <h3 className="text-white text-lg font-bold mb-1">Nossa Aventura</h3>
                        <p className="text-gray-400 text-xs leading-relaxed">
                            Descobrindo novos lugares e criando memórias inesquecíveis.
                        </p>
                    </div>

                    {/* Event 3: Hoje */}
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]"></div>
                        <span className="text-[#3b82f6] text-[10px] font-bold tracking-widest uppercase mb-1 block">Hoje</span>
                        <h3 className="text-white text-lg font-bold mb-1">E contando...</h3>
                    </div>
                </div>
            </div>

            {/* Header */}
            <h2 className="text-gray-400 tracking-[0.2em] text-xs font-medium uppercase mb-8 opacity-50">Tempo de Nós</h2>

            {/* Main Time Grid */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-8 w-full px-8 mb-6">
                <TimeUnit value={time.years} label="Anos" />
                <TimeUnit value={time.months} label="Meses" />
                <TimeUnit value={time.days} label="Dias" />

                <TimeUnit value={time.hours} label="Horas" />
                <TimeUnit value={time.minutes} label="Minutos" />
                <TimeUnit value={time.seconds} label="Segundos" />
            </div>

            {/* Milliseconds */}
            <div className="flex flex-col items-center mb-10">
                <span className="text-4xl font-serif text-[#d81b60] font-bold">
                    .{time.milliseconds.toString().padStart(3, '0')}
                </span>
                <span className="text-[10px] tracking-widest text-[#d81b60]/60 font-bold uppercase mt-1">MS</span>
            </div>

            {/* Pulsing Heart */}
            <div className="flex flex-col items-center mb-12">
                <div className="relative flex items-center justify-center w-24 h-24">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 bg-[#f50057] rounded-full blur-xl opacity-40"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                        className="w-16 h-16 bg-gradient-to-tr from-[#c51162] to-[#ff4081] rounded-full flex items-center justify-center shadow-lg relative z-10"
                    >
                        <Heart fill="white" className="text-white w-8 h-8" />
                    </motion.div>
                </div>
                <span className="text-[#d81b60] text-[10px] tracking-widest font-bold uppercase mt-4 opacity-80">Vivo e Pulsante</span>
            </div>

            {/* Footer Cards */}
            <div className="grid grid-cols-3 gap-3 px-4 w-full">
                <StatCard
                    icon={Activity}
                    value={stats.heartbeats}
                    label="Batimentos"
                    sub="Corações sintonizados"
                />
                <StatCard
                    icon={Moon}
                    value={stats.fullMoons}
                    label="Luas Cheias"
                    sub="Noites iluminadas"
                />
                <StatCard
                    icon={CloudSun}
                    value={stats.seasons.toString()}
                    label="Estações"
                    sub="Ciclos vividos"
                />
            </div>

        </div>
    );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-5xl font-serif text-white font-medium drop-shadow-lg">
                {value}
            </span>
            <span className="text-[10px] tracking-widest text-gray-500 font-bold uppercase mt-2">
                {label}
            </span>
        </div>
    );
}

function StatCard({ icon: Icon, value, label, sub }: { icon: any, value: string, label: string, sub: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center backdrop-blur-sm">
            <Icon className="text-gray-400 mb-2 w-5 h-5" />
            <span className="text-white font-bold text-sm mb-1">{value}</span>
            <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1">{label}</span>
            <span className="text-[8px] text-gray-600 leading-tight">{sub}</span>
        </div>
    );
}
