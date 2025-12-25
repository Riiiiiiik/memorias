"use client";

import React, { useState } from "react";
import { BottomNav } from "./BottomNav";
import { HomeScreen } from "./screens/HomeScreen";
import { TimerScreen } from "./screens/TimerScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { MusicScreen } from "./screens/MusicScreen";
import { StoryScreen } from "./screens/StoryScreen";

interface MobileAppShellProps {
    initialMemories: any[];
    content: any;
    hasRealMemories: boolean;
    stories: any[];
}

type TabId = "home" | "story" | "timer" | "gallery" | "music";

export function MobileAppShell({ initialMemories, content, hasRealMemories, stories }: MobileAppShellProps) {
    const [activeTab, setActiveTab] = useState<TabId>("home");

    return (
        <div className="flex justify-center min-h-screen">
            <div className="relative w-full max-w-md h-[100dvh] overflow-hidden shadow-2xl">
                {/* 
          We render ALL screens but toggle visibility/z-index using 'isActive'.
          This preserves state (like scroll position, scratched card status) when switching tabs.
        */}

                <HomeScreen
                    isActive={activeTab === "home"}
                    onNavigateToGallery={() => setActiveTab("timer")}
                />

                <StoryScreen
                    isActive={activeTab === "story"}
                    stories={stories}
                />

                <TimerScreen isActive={activeTab === "timer"} />

                <MusicScreen isActive={activeTab === "music"} />

                <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabId)} />
            </div>
        </div>
    );
}
