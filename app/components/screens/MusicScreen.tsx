"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface MusicScreenProps {
    isActive: boolean;
}

const PLAYLIST = [
    {
        title: "2h30",
        artist: "Sotam, Rob Fique, Thomaz Matos",
        videoId: "cvb4vUPHylk"
    },
    {
        title: "Altitude",
        artist: "Montell Fish",
        videoId: "4YlkYj70TGY"
    },
    {
        title: "Blame",
        artist: "Montell Fish",
        videoId: "mkQe2TXqn_c"
    },
    {
        title: "Te Amo Disgraça",
        artist: "Baco Exu do Blues",
        videoId: "qeO5EBBCPm0"
    },
    {
        title: "Pausa da Sua Tristeza",
        artist: "Baco Exu do Blues, Liniker",
        videoId: "OowhMq5stCU"
    },
];

export function MusicScreen({ isActive }: MusicScreenProps) {
    const [currentSong, setCurrentSong] = useState(PLAYLIST[0]);

    // Generate YouTube embed URL with autoplay
    const embedUrl = `https://www.youtube.com/embed/${currentSong.videoId}?autoplay=1&controls=1&modestbranding=1&playsinline=1`;

    return (
        <div className={cn("app-screen flex flex-col items-center justify-start h-full w-full absolute top-0 left-0 transition-opacity duration-300 pt-10 overflow-y-auto pb-24",
            isActive ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
        )}>

            <div className="w-full max-w-sm px-6 flex flex-col items-center">

                {/* Header */}
                <h2 className="text-gray-400 tracking-[0.2em] text-xs font-medium uppercase mb-8">Nossa Vibe</h2>

                {/* Video Container (Native YouTube Embed) */}
                <div className="w-full aspect-video bg-[#1a1b2e] rounded-2xl mb-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <iframe
                        key={currentSong.videoId}
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* Current Song Info */}
                <div className="text-center mb-10">
                    <h2 className="text-white text-xl font-bold tracking-tight mb-1">{currentSong.title}</h2>
                    <p className="text-[#d81b60] font-medium text-sm">{currentSong.artist}</p>
                </div>

                {/* Playlist */}
                <div className="w-full space-y-3">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 px-1">Próximas</h3>

                    {PLAYLIST.map((song, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSong(song)}
                            className={cn(
                                "w-full flex items-center p-3 rounded-xl transition-all text-left group",
                                currentSong.videoId === song.videoId
                                    ? "bg-white/10 ring-1 ring-[#d81b60]/50"
                                    : "bg-white/5 hover:bg-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors",
                                currentSong.videoId === song.videoId ? "bg-[#d81b60]" : "bg-white/10 group-hover:bg-white/20"
                            )}>
                                <Play size={16} fill="currentColor" className={cn(
                                    "ml-1",
                                    currentSong.videoId === song.videoId ? "text-white" : "text-gray-400"
                                )} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={cn(
                                    "font-bold text-sm truncate",
                                    currentSong.videoId === song.videoId ? "text-white" : "text-gray-300"
                                )}>
                                    {song.title}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                            </div>

                            {currentSong.videoId === song.videoId && (
                                <div className="ml-2">
                                    <div className="w-2 h-2 rounded-full bg-[#d81b60] animate-pulse"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
