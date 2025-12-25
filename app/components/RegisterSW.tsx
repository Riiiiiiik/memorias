'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered:', registration);

                        // Detect updates
                        registration.onupdatefound = () => {
                            const installingWorker = registration.installing;
                            if (installingWorker) {
                                installingWorker.onstatechange = () => {
                                    if (installingWorker.state === 'installed') {
                                        if (navigator.serviceWorker.controller) {
                                            // New content is available; forced reload
                                            console.log('New content detected, refreshing...');
                                            window.location.reload();
                                        }
                                    }
                                };
                            }
                        };
                    })
                    .catch((error) => {
                        console.error('SW registration failed:', error);
                    });
            });
        }
    }, []);

    return null;
}
