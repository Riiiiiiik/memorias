"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Video as VideoIcon, Youtube as YoutubeIcon } from "lucide-react";

export interface Memory {
    id: string;
    title: string;
    description?: string;
    date?: string;
    imageUrl?: string;
    mediaType?: 'image' | 'video' | 'youtube'; // Supported types
    color?: string; // Optional accent color
}

interface MemoryCardProps {
    memory: Memory;
    idx?: number; // Index in the stack to determine initial visual offset if needed locally
}

// Helper to extract YouTube Video ID
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export function MemoryCard({ memory }: MemoryCardProps) {
    const isVideo = memory.mediaType === 'video';
    const isYoutube = memory.mediaType === 'youtube';

    return (
        <div className="relative w-[340px] h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden p-3 select-none flex flex-col">
            {/* Photo/Video/Youtube Area */}
            <div className="relative w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden mb-4 shadow-inner group">
                {memory.imageUrl ? (
                    isYoutube ? (
                        <div className="w-full h-full relative pointer-events-auto">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${getYoutubeId(memory.imageUrl)}?controls=0&modestbranding=1&rel=0`}
                                title={memory.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay to prevent interactions if needed, but here we might want them? 
                                Usually in a carousel, direct iframe interaction can be tricky. 
                                Let's add a transparent overlay that disappears on click if we want to play?
                                For now, standard iframe. */}
                        </div>
                    ) : isVideo ? (
                        <video
                            src={memory.imageUrl}
                            className="w-full h-full object-cover pointer-events-none"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <img
                            src={memory.imageUrl}
                            alt={memory.title}
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false}
                            loading="eager"
                            onError={(e) => {
                                console.error('Failed to load image:', memory.imageUrl);
                            }}
                        />
                    )
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={48} />
                    </div>
                )}

                {/* Shine effect overlay (disabled for youtube to allow interaction) */}
                {!isYoutube && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}

                {/* Indicator Icons */}
                {isVideo && (
                    <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm pointer-events-none">
                        <VideoIcon size={12} className="text-white" />
                    </div>
                )}
                {isYoutube && (
                    <div className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full backdrop-blur-sm pointer-events-none z-10">
                        <YoutubeIcon size={12} className="text-white" />
                    </div>
                )}
            </div>

            {/* Caption Area */}
            <div className="flex-1 flex flex-col justify-center px-2">
                <h3 className="font-serif text-xl text-gray-800 font-bold leading-tight line-clamp-1">
                    {memory.title}
                </h3>
                {memory.date && (
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                        {memory.date}
                    </p>
                )}
            </div>

            {/* Subtle texture/paper effect */}
            <div className={`absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isYoutube ? 'hidden' : ''}`} />
        </div>
    );
}
