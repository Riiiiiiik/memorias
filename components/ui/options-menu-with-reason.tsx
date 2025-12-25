'use client';

import { useState } from 'react';
import { OptionsMenu } from '@/components/ui/options-menu';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

type Reason = {
    id: string;
    texto: string;
};

const FALLBACK_REASONS = [
    "Te amo por causa do teu sorriso, que ilumina os meus dias mesmo quando tudo parece nublado.",
    "Te amo porque a tua voz tem o poder de me acalmar, e o som da tua risada é o meu favorito no mundo.",
    "Te amo porque contigo eu aprendi o que é ter um lar — não um lugar, mas alguém onde eu quero sempre estar.",
    "Te amo porque o teu abraço é o meu refúgio, o único lugar onde o tempo parece parar.",
    "Te amo porque tu transformas qualquer momento simples em algo inesquecível.",
    "Te amo porque teus olhos falam comigo de um jeito que ninguém mais entende.",
    "Te amo porque acreditas em mim mesmo quando eu não acredito.",
    "Te amo por esse teu coração enorme, que ama sem medo e cuida sem medida.",
    "Te amo porque perto de ti, eu sou a melhor versão de mim.",
    "Te amo porque tu fazes da vida algo mais leve.",
    "Te amo porque teu toque me traz calma e teu riso me devolve alegria.",
    "Te amo porque teus gestos, mesmo os pequenos, carregam carinho.",
    "Te amo porque me entendes até no silêncio.",
    "Te amo porque teu amor é sincero, sereno e verdadeiro.",
    "Te amo porque tu sabes me olhar do jeito certo, no momento certo.",
    "Te amo porque contigo aprendi que amar também é ser paciente.",
    "Te amo porque me fazes rir mesmo quando estou tentando ficar bravo.",
    "Te amo porque tu tornas os meus dias mais coloridos.",
    "Te amo porque teu carinho me faz sentir protegido.",
    "Te amo porque tu és minha paz no meio do caos.",
    "Te amo porque tu acreditas na gente com uma fé que me inspira.",
    "Te amo porque teus defeitos me lembram que somos humanos e reais.",
    "Te amo porque tu me escolhes todos os dias, e isso é o que mais importa.",
    "Te amo porque o teu cheiro já é parte de mim.",
    "Te amo porque tu sabes me acalmar sem precisar dizer nada.",
    "Te amo porque o teu silêncio também é companhia.",
    "Te amo porque a tua presença preenche o meu mundo.",
    "Te amo porque contigo aprendi o valor da parceria.",
    "Te amo porque tu me ensinas o que é amor de verdade sem precisar de palavras bonitas.",
    "Te amo porque tu és meu lar, meu abrigo, meu lugar favorito.",
    "Te amo porque tu és tudo aquilo que eu nem sabia que precisava.",
    "Te amo porque contigo os meus sonhos param de ser apenas sonhos.",
    "Te amo porque tu me olhas com ternura mesmo quando estou de mau humor.",
    "Te amo porque me aceitas exatamente como eu sou.",
    "Te amo porque tu dás sentido aos meus dias.",
    "Te amo porque contigo o amor deixou de ser um sonho e virou realidade.",
    "Te amo porque tu és a minha paz, o meu caos bonito.",
    "Te amo porque cada segundo ao teu lado vale uma vida inteira.",
    "Te amo porque tu existes — e só isso já é motivo suficiente."
];

import { LoginModal } from '@/components/auth/login-modal';

// ... (imports)

export function OptionsMenuWithReason() {
    const [reasons, setReasons] = useState<string[]>([]);
    const [currentReason, setCurrentReason] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchReasons() {
            const { data, error } = await supabase
                .from('motivos')
                .select('texto');

            if (error || !data || data.length === 0) {
                console.log('Using fallback reasons');
                setReasons(FALLBACK_REASONS);
            } else {
                setReasons(data.map(r => r.texto));
            }
        }

        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        }

        fetchReasons();
        checkUser();
    }, [supabase]);

    const showReason = () => {
        setIsLoading(true);
        setTimeout(() => {
            let nextReason = currentReason;

            if (reasons.length > 1) {
                do {
                    const randomIndex = Math.floor(Math.random() * reasons.length);
                    nextReason = reasons[randomIndex];
                } while (nextReason === currentReason);
            } else {
                nextReason = reasons[0];
            }

            setCurrentReason(nextReason);
            setIsOpen(true);
            setIsLoading(false);
        }, 300);
    };

    return (
        <>
            <OptionsMenu
                onShowReason={showReason}
                onLogin={() => setIsLoginOpen(true)}
                isLoggedIn={isLoggedIn}
            />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />


            {/* Love Reason Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            className="relative w-full max-w-lg glass-panel p-8 md:p-12 rounded-3xl text-center border border-white/20 shadow-2xl bg-black/20"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-6 flex justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                                </motion.div>
                            </div>

                            <motion.h3
                                className="text-2xl md:text-3xl font-serif text-white leading-relaxed"
                                key={currentReason}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                &quot;{currentReason}&quot;
                            </motion.h3>

                            <div className="mt-8 flex justify-center gap-4">
                                <motion.button
                                    className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors border border-white/10"
                                    onClick={showReason}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Ver outro motivo
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
