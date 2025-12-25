"use client";

import React, { useState, useEffect } from "react";
import { BottomNav } from "./BottomNav";
import { HomeScreen } from "./screens/HomeScreen";
import { TimerScreen } from "./screens/TimerScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { MusicScreen } from "./screens/MusicScreen";
import { StoryScreen } from "./screens/StoryScreen";
import { APP_VERSION } from "@/lib/version";
import { createClient } from "@/lib/supabase/client";

interface MobileAppShellProps {
    initialMemories: any[];
    content: any;
    hasRealMemories: boolean;
    stories: any[];
}

type TabId = "home" | "story" | "timer" | "gallery" | "music";

export function MobileAppShell({ initialMemories, content, hasRealMemories, stories }: MobileAppShellProps) {
    const [activeTab, setActiveTab] = useState<TabId>("home");

    // Strict Login Enforcement
    useEffect(() => {
        const checkVersionAndAuth = async () => {
            const storedVersion = localStorage.getItem('app_version');

            if (storedVersion !== APP_VERSION) {
                console.log('App updated. Forcing logout for strict security.');

                // 1. Update stored version
                localStorage.setItem('app_version', APP_VERSION);

                // 2. Clear Supabase Session
                const supabase = createClient();
                await supabase.auth.signOut();

                // 3. Force page reload to trigger middleware redirection to /login
                window.location.href = '/login';
            }
        };

        checkVersionAndAuth();
    }, []);

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
