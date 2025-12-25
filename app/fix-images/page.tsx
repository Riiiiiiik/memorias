'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Memory {
    id: string;
    title: string;
    image_url: string;
    media_type?: string;
}

interface ImageStatus {
    memory: Memory;
    status: 'loading' | 'success' | 'error';
    error?: string;
}

export default function FixImagesPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchMemories();
    }, []);

    const fetchMemories = async () => {
        const { data, error } = await supabase
            .from('memorias')
            .select('*')
            .order('date', { ascending: false });

        if (data) {
            setMemories(data);
            // Initialize statuses
            setImageStatuses(data.map(m => ({ memory: m, status: 'loading' })));
        }
        setLoading(false);
    };

    const deleteAllBroken = async () => {
        const count = brokenImages.length;

        if (!confirm(`⚠️ ATENÇÃO!\n\nVocê está prestes a DELETAR ${count} memórias com imagens quebradas.\n\nEsta ação NÃO PODE SER DESFEITA!\n\nDeseja continuar?`)) {
            return;
        }

        setDeleting(true);

        try {
            const ids = brokenImages.map(s => s.memory.id);

            // Delete all broken memories
            const { error } = await supabase
                .from('memorias')
                .delete()
                .in('id', ids);

            if (error) throw error;

            alert(`✅ ${count} memórias deletadas com sucesso!`);

            // Refresh the list
            await fetchMemories();
        } catch (error: any) {
            console.error('Error deleting:', error);
            alert('❌ Erro ao deletar: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const testImage = (memory: Memory, index: number) => {
        if (memory.media_type === 'video' || memory.media_type === 'youtube') {
            setImageStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[index] = { memory, status: 'success' };
                return newStatuses;
            });
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[index] = { memory, status: 'success' };
                return newStatuses;
            });
        };
        img.onerror = () => {
            setImageStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[index] = {
                    memory,
                    status: 'error',
                    error: 'Falha ao carregar imagem'
                };
                return newStatuses;
            });
        };
        img.src = memory.image_url;
    };

    useEffect(() => {
        if (memories.length > 0) {
            memories.forEach((memory, index) => {
                testImage(memory, index);
            });
        }
    }, [memories]);

    const brokenImages = imageStatuses.filter(s => s.status === 'error');
    const workingImages = imageStatuses.filter(s => s.status === 'success');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p>Carregando memórias...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-8">🔧 Diagnóstico de Imagens</h1>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-900/50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold">{memories.length}</div>
                    <div className="text-sm text-gray-400 mt-2">Total de Memórias</div>
                </div>
                <div className="bg-green-900/50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-green-400">{workingImages.length}</div>
                    <div className="text-sm text-gray-400 mt-2">✅ Funcionando</div>
                </div>
                <div className="bg-red-900/50 p-6 rounded-lg text-center">
                    <div className="text-4xl font-bold text-red-400">{brokenImages.length}</div>
                    <div className="text-sm text-gray-400 mt-2">❌ Quebradas</div>
                </div>
            </div>

            {/* Broken Images */}
            {brokenImages.length > 0 && (
                <div className="mb-8 bg-red-900/20 border border-red-500/50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-red-400">❌ Imagens Quebradas ({brokenImages.length})</h2>
                        <button
                            onClick={deleteAllBroken}
                            disabled={deleting}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                            {deleting ? (
                                <>
                                    <div className="animate-spin">⏳</div>
                                    Deletando...
                                </>
                            ) : (
                                <>
                                    🗑️ Deletar Todas ({brokenImages.length})
                                </>
                            )}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {brokenImages.map(({ memory }) => (
                            <div key={memory.id} className="bg-gray-950 p-4 rounded">
                                <h3 className="font-bold mb-2">{memory.title}</h3>
                                <div className="text-xs text-gray-400 mb-2">ID: {memory.id}</div>
                                <div className="bg-gray-900 p-2 rounded">
                                    <p className="text-xs text-gray-500 mb-1">URL:</p>
                                    <code className="text-xs text-red-400 break-all">{memory.image_url}</code>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <a
                                        href={`/admin`}
                                        className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                                    >
                                        Editar no Admin
                                    </a>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(memory.image_url);
                                            alert('URL copiada!');
                                        }}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                                    >
                                        Copiar URL
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Working Images */}
            <div className="mb-8 bg-green-900/20 border border-green-500/50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-green-400">✅ Imagens Funcionando ({workingImages.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {workingImages.slice(0, 8).map(({ memory }) => (
                        <div key={memory.id} className="bg-gray-950 p-2 rounded">
                            <div className="aspect-square bg-gray-900 rounded mb-2 overflow-hidden">
                                {memory.media_type === 'image' || !memory.media_type ? (
                                    <img
                                        src={memory.image_url}
                                        alt={memory.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                        {memory.media_type}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs truncate">{memory.title}</p>
                        </div>
                    ))}
                </div>
                {workingImages.length > 8 && (
                    <p className="text-xs text-gray-500 mt-4">... e mais {workingImages.length - 8} imagens</p>
                )}
            </div>

            {/* Solutions */}
            <div className="bg-blue-900/30 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">💡 Como Corrigir:</h2>
                <ol className="space-y-3 text-sm list-decimal list-inside">
                    <li>Para cada imagem quebrada, vá no <strong>Admin</strong> e clique em <strong>Editar</strong></li>
                    <li>Faça upload da imagem novamente ou cole uma URL válida</li>
                    <li>Ou delete a memória se não for mais necessária</li>
                </ol>
            </div>

            <div className="flex gap-4">
                <a href="/" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg inline-block">
                    ← Home
                </a>
                <a href="/admin" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg inline-block">
                    Ir para Admin →
                </a>
                <a href="/debug" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg inline-block">
                    Debug Simples
                </a>
            </div>
        </div>
    );
}
