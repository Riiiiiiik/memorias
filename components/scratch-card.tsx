'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScratchCardProps {
    width: number;
    height: number;
    secretImage?: string; // URL da imagem de fundo
    coverColor?: string; // Cor da raspadinha (ex: '#C0C0C0')
    onRevealComplete?: () => void;
    revealThreshold?: number; // Porcentagem para completar (0-100)
}

export function ScratchCard({
    width,
    height,
    secretImage,
    coverColor = '#C0C0C0',
    onRevealComplete,
    revealThreshold = 50,
}: ScratchCardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurar Canvas
        canvas.width = width;
        canvas.height = height;

        // Pintar a camada de cobertura (Textura Realista)
        if (coverColor === 'silver' || coverColor === '#C0C0C0' || !secretImage) {
            // Criar gradiente prateado
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#e8e8e8');
            gradient.addColorStop(0.5, '#c0c0c0');
            gradient.addColorStop(1, '#a8a8a8');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Adicionar ruído (noise) para textura de raspadinha
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 30; // Variação de brilho
                data[i] = Math.min(255, Math.max(0, data[i] + noise));     // R
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
            }
            ctx.putImageData(imageData, 0, 0);
        } else {
            ctx.fillStyle = coverColor;
            ctx.fillRect(0, 0, width, height);
        }

        // Adicionar texto ou instrução (opcional)
        ctx.fillStyle = '#555';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';

        // Sombra do texto para parecer relevo
        ctx.shadowColor = "rgba(255,255,255,0.5)";
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText("RASPE AQUI", width / 2, height / 2);

        // Resetar shadow
        ctx.shadowColor = "transparent";

        // Configurar pincel para "apagar"
        ctx.globalCompositeOperation = 'destination-out';
    }, [width, height, coverColor]);

    const checkRevealPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Obter dados dos pixels
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        // Contar pixels transparentes (canal Alpha < 128)
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) {
                transparentPixels++;
            }
        }

        const totalPixels = width * height;
        const percentage = (transparentPixels / totalPixels) * 100;

        if (percentage > revealThreshold) {
            completeReveal();
        }
    };

    const completeReveal = () => {
        setIsRevealed(true);
        const canvas = canvasRef.current;
        if (canvas) {
            // Opcional: Animação de fade-out do canvas restante
            canvas.style.opacity = '0';
            canvas.style.transition = 'opacity 1s ease-out';
        }
        if (onRevealComplete) onRevealComplete();
    };

    const getPosition = (e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (window.TouchEvent && e instanceof TouchEvent) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e instanceof MouseEvent) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            return { x: 0, y: 0 };
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const scratch = (e: any) => {
        if (!isDrawing || isRevealed) return;

        // Previne scroll no mobile enquanto raspa
        if (e.type.includes('touch')) {
            // Nota: 'touch-action: none' no CSS é preferível, mas preventDefault ajuda em alguns casos
            // e.preventDefault(); // Comentado pois touch-action: none deve lidar com isso
        }

        const pos = getPosition(e.nativeEvent || e);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2); // Tamanho do pincel
        ctx.fill();

        // Otimização: REMOVIDO check durante o movimento para evitar travamentos.
        // A verificação será feita apenas no final da interação (MouseUp/TouchEnd)
        // Isso garante 60FPS durante a raspagem.
        /* 
        if (Math.random() > 0.8) { 
            checkRevealPercentage();
        }
        */
    };

    return (
        <div
            className="relative rounded-xl overflow-hidden shadow-2xl select-none"
            style={{ width, height }}
            ref={containerRef}
        >
            {/* Imagem de Fundo (Prêmio) */}
            {secretImage && (
                <img
                    src={secretImage}
                    alt="Segredo"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
                />
            )}

            {/* Conteúdo Customizado Atrás (Se não for apenas imagem) */}
            {!secretImage && (
                <div className="absolute top-0 left-0 w-full h-full bg-white z-0 flex items-center justify-center">
                    <span className="text-gray-400">?</span>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-10 cursor-pointer touch-none"
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => { setIsDrawing(false); checkRevealPercentage(); }}
                onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={scratch}
                onTouchStart={(e) => { setIsDrawing(true); scratch(e); }}
                onTouchEnd={() => { setIsDrawing(false); checkRevealPercentage(); }}
                onTouchMove={scratch}
                style={{ touchAction: 'none' }} // Crucial para mobile!
            />
        </div>
    );
}
