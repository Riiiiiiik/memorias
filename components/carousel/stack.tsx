"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Memory, MemoryCard } from "./memory-card";

interface StackCarouselProps {
    memories: Memory[];
}

export function StackCarousel({ memories: initialMemories }: StackCarouselProps) {
    const [memories, setMemories] = useState(initialMemories);
    const [exitX, setExitX] = useState<number | null>(null);

    // Top card motion values for drag interaction
    const x = useMotionValue(0);
    const scale = useTransform(x, [-150, 0, 150], [0.9, 1, 0.9]);
    const rotate = useTransform(x, [-150, 0, 150], [-10, 0, 10]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x < -100) {
            setExitX(-200);
            removeCard();
        } else if (info.offset.x > 100) {
            setExitX(200);
            removeCard();
        }
    };

    const removeCard = () => {
        setMemories((current) => {
            const newMemories = [...current];
            // Move first item to the end (infinite loop)
            const first = newMemories.shift();
            if (first) newMemories.push(first);
            return newMemories;
        });
        setExitX(null);
        x.set(0);
    };

    return (
        <div className="relative w-full h-[520px] flex items-center justify-center perspective-1000">
            <AnimatePresence mode="popLayout">
                {memories.slice(0, 3).map((memory, index) => {
                    const isFront = index === 0;

                    return (
                        <motion.div
                            key={memory.id}
                            style={{
                                zIndex: 3 - index,
                                x: isFront ? x : 0,
                                rotate: isFront ? rotate : 0,
                                scale: isFront ? scale : 1 - index * 0.05,
                                willChange: 'transform', // GPU acceleration hint
                            }}
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{
                                scale: 1 - index * 0.05,
                                opacity: 1 - index * 0.2,
                                y: index * 15,
                                x: isFront ? 0 : 0,
                            }}
                            exit={{
                                x: exitX ?? 0,
                                opacity: 0,
                                scale: 0.8,
                                transition: { duration: 0.15, ease: "easeOut" },
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                mass: 0.5,
                            }}
                            drag={isFront ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.15}
                            onDragEnd={handleDragEnd}
                            whileTap={{ cursor: "grabbing" }}
                            className="absolute top-8 cursor-grab touch-pan-y"
                        >
                            <MemoryCard memory={memory} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
