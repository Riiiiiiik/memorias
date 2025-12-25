"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Settings } from "lucide-react";

interface Story {
    id: string;
    image_url: string;
    text_content: string;
    order_index: number;
    layout_type: 'text_overlay' | 'text_top' | 'text_bottom';
    zoom_level: number;
}

interface StoryScreenProps {
    isActive: boolean;
    stories: Story[];
}

export function StoryScreen({ isActive, stories }: StoryScreenProps) {
    // Shuffle logic: We memoize the shuffled order to avoid reshuffling on every render,
    // but we want it to be random on every fresh mount (effectively when visiting the tab).
    const shuffledStories = useMemo(() => {
        const list = [...stories];
        // Fisher-Yates shuffle
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }, [stories]); // Only reshuffle if the source data actually changes

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-advance logic
    useEffect(() => {
        if (!isActive || shuffledStories.length <= 1) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % shuffledStories.length);
        }, 5000); // 5 seconds per slide

        return () => clearInterval(timer);
    }, [isActive, shuffledStories.length]); const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        if (shuffledStories.length === 0) return;

        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = shuffledStories.length - 1;
            if (nextIndex >= shuffledStories.length) nextIndex = 0;
            return nextIndex;
        });
    };

    if (shuffledStories.length === 0) {
        return (
            <div
                className={cn(
                    "app-screen absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-500",
                    isActive ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
                )}
            >
                {/* Admin Button */}
                {isActive && (
                    <Link
                        href="/admin"
                        className="fixed top-4 right-4 z-[90] p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group"
                    >
                        <Settings size={20} className="text-purple-600 group-hover:rotate-90 transition-transform duration-300" />
                    </Link>
                )}

                <div className="text-center text-white/50 p-8">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-xl font-serif mb-2">Nenhuma história ainda</p>
                    <p className="text-sm">Adicione conteúdo no painel de Admin</p>
                </div>
            </div>
        );
    }

    const currentStory = shuffledStories[currentIndex];
    const isOverlay = currentStory.layout_type === 'text_overlay';
    const isTextTop = currentStory.layout_type === 'text_top';

    return (
        <div
            className={cn(
                "app-screen absolute top-0 left-0 w-full h-full overflow-hidden transition-opacity duration-500",
                isActive ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
            )}
        >
            {/* Admin Button */}
            {isActive && (
                <Link
                    href="/admin"
                    className="fixed top-4 right-4 z-[90] p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group"
                >
                    <Settings size={20} className="text-purple-600 group-hover:rotate-90 transition-transform duration-300" />
                </Link>
            )}

            {/* Progress Indicators */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {shuffledStories.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={cn(
                            "h-1 rounded-full transition-all duration-300",
                            index === currentIndex
                                ? "w-8 bg-white"
                                : "w-6 bg-white/30 hover:bg-white/50"
                        )}
                    />
                ))}
            </div>

            {/* Card Carousel */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        style={{ touchAction: "none" }}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            // Reduced threshold for easier swiping
                            if (swipe < -100) {
                                paginate(1);
                            } else if (swipe > 100) {
                                paginate(-1);
                            }
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing"
                    >
                        {/* Content Container */}
                        <div className="w-full max-w-sm flex flex-col items-center gap-8 z-10">

                            {/* Text Content (Top) */}
                            {currentStory.text_content && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-full text-center"
                                >
                                    <p className={cn(
                                        "font-serif text-white/90 text-2xl leading-relaxed drop-shadow-md",
                                        isTextTop ? "text-3xl font-bold" : "" // Larger if specifically "top" style
                                    )}>
                                        {currentStory.text_content}
                                    </p>
                                </motion.div>
                            )}

                            {/* Image Card */}
                            <motion.div
                                className="relative w-full aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <motion.img
                                    src={currentStory.image_url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    initial={{ scale: currentStory.zoom_level || 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    draggable={false}
                                />

                                {/* Subtle gradient for depth */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />
                            </motion.div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                {currentIndex + 1} / {shuffledStories.length}
            </div>
        </div>
    );
}
