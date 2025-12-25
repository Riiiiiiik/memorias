'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import Link from 'next/link';

export function FloatingSurpriseButton() {
    return (
        <Link href="/raspadinha">
            <motion.button
                className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg border border-white/30 text-white flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                initial={{ y: 0 }}
                animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                        "0px 10px 25px rgba(236, 72, 153, 0.5)",
                        "0px 20px 30px rgba(236, 72, 153, 0.7)",
                        "0px 10px 25px rgba(236, 72, 153, 0.5)"
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                aria-label="Ver surpresa"
            >
                <Gift size={28} className="text-white drop-shadow-md" />

                {/* Glowing effect inside */}
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md -z-10" />
            </motion.button>
        </Link>
    );
}
