'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubePlayerProps {
    videoId: string;
    autoplay?: boolean;
}

// YouTube IFrame API types
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export function YouTubePlayer({ videoId, autoplay = false }: YouTubePlayerProps) {
    const [isReady, setIsReady] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        // Initialize player when API is ready
        const initPlayer = () => {
            if (window.YT && containerRef.current) {
                playerRef.current = new window.YT.Player(containerRef.current, {
                    height: '315',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                    },
                    events: {
                        onReady: () => {
                            setIsReady(true);
                        },
                    },
                });
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            window.onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId]);

    const handleStart = () => {
        if (playerRef.current && isReady) {
            playerRef.current.playVideo();
            setHasStarted(true);
        }
    };

    return (
        <div className="relative w-full">
            {!hasStarted && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                    <button
                        onClick={handleStart}
                        disabled={!isReady}
                        className="group relative flex items-center gap-3 bg-white px-8 py-3.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Simple Play Icon - Apple Style */}
                        <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>

                        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
                            {isReady ? 'Iniciar Experiência' : 'Carregando...'}
                        </span>
                    </button>
                </div>
            )}
            <div
                ref={containerRef}
                className="w-full rounded-xl overflow-hidden"
                style={{ minHeight: '315px' }}
            />
        </div>
    );
}
