'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Memory {
    id: string;
    title: string;
    image_url: string;
    media_type?: string;
}

export default function DebugPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMemories() {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('memorias')
                    .select('*')
                    .limit(5)
                    .order('date', { ascending: false });

                if (error) throw error;
                setMemories(data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMemories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p>Carregando debug...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">🔍 Debug - Imagens</h1>

            {error && (
                <div className="bg-red-900/50 p-4 rounded mb-4">
                    <p className="font-bold">❌ Erro ao buscar memórias:</p>
                    <pre className="text-sm mt-2">{error}</pre>
                </div>
            )}

            <div className="mb-8 bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">🖼️ Primeiras 5 Memórias:</h2>

                {memories.length === 0 ? (
                    <p className="text-gray-400">Nenhuma memória encontrada no banco.</p>
                ) : (
                    memories.map((memory) => (
                        <div key={memory.id} className="mb-6 bg-gray-950 p-4 rounded">
                            <h3 className="font-bold text-lg mb-2">{memory.title}</h3>

                            <div className="mb-3">
                                <p className="text-sm text-gray-400 mb-1">URL no banco:</p>
                                <code className="text-xs bg-gray-900 p-2 rounded block break-all">
                                    {memory.image_url}
                                </code>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-400 mb-1">
                                    Tipo: <span className="text-white">{memory.media_type || 'image'}</span>
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                                <div className="w-full max-w-md h-48 bg-gray-900 rounded flex items-center justify-center border border-gray-700">
                                    {memory.media_type === 'image' || !memory.media_type ? (
                                        <img
                                            src={memory.image_url}
                                            alt={memory.title}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                if (target.parentElement) {
                                                    target.parentElement.innerHTML = '<div class="text-center"><span class="text-red-500 text-2xl">❌</span><p class="text-red-400 text-sm mt-2">Falha ao carregar</p></div>';
                                                }
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-500">Vídeo/YouTube</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-blue-900/50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">💡 Soluções Comuns:</h2>
                <ol className="space-y-3 text-sm list-decimal list-inside">
                    <li>
                        <strong>Bucket não público:</strong> Execute no SQL Editor:
                        <pre className="bg-gray-950 p-2 rounded mt-2 text-xs overflow-auto">
                            UPDATE storage.buckets SET public = true WHERE name = 'memorias';
                        </pre>
                    </li>
                    <li>
                        <strong>URL errada:</strong> Deve começar com:
                        <code className="bg-gray-950 px-2 py-1 rounded text-xs ml-2 block mt-1">
                            https://[projeto].supabase.co/storage/v1/object/public/memorias/...
                        </code>
                    </li>
                </ol>
            </div>

            <div className="flex gap-4">
                <a href="/" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg inline-block">
                    ← Voltar
                </a>
                <a href="/admin" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg inline-block">
                    Admin →
                </a>
            </div>
        </div>
    );
}
