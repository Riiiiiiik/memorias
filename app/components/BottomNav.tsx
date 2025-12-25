"use client";

import React from "react";
import { Home, Hourglass, Images, Music, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "home" | "story" | "timer" | "gallery" | "music";

interface BottomNavProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const navItems = [
        { id: "home", label: "Início", icon: Home },
        { id: "story", label: "Narrativa", icon: BookOpen },
        { id: "timer", label: "Tempo", icon: Hourglass },
        { id: "music", label: "Música", icon: Music },
    ] as const;

    return (
        <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-white/90 backdrop-blur-md h-[70px] flex justify-around items-center shadow-[0_8px_32px_rgba(216,27,96,0.2)] z-[1000] rounded-full px-2 border border-white/50">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className="flex flex-col items-center justify-center bg-transparent border-none cursor-pointer w-full h-full relative"
                    >
                        {/* Pill Container for ICON only */}
                        <div className={cn(
                            "flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all duration-300",
                            isActive ? "bg-[#d81b60] shadow-lg shadow-pink-300 transform -translate-y-3" : "bg-transparent hover:bg-pink-50"
                        )}>
                            <Icon
                                size={24}
                                className={cn(
                                    "transition-all duration-300",
                                    isActive ? "text-white" : "text-gray-400"
                                )}
                            />
                        </div>

                        {/* Label - Show only when active or maybe just small dot? 
                            Let's keep text but make it animate in/out or just sit below the floating pill? 
                            Actually, with the transform -translate-y, the text might look detached.
                            Let's change design slightly:
                            Active: Icon floats up, Text appears?
                            Or just simple Pill design:
                        */}

                        <span className={cn(
                            "absolute bottom-1 text-[10px] font-bold transition-all duration-300",
                            isActive ? "opacity-100 text-[#d81b60] transform -translate-y-0" : "opacity-0 transform translate-y-2 pointer-events-none"
                        )}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
