"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, Save, CheckCircle, Trash2, Edit, X, LogOut, ImagePlus, Youtube, Link, BookOpen, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/actions";
import { Reorder } from "framer-motion";

interface Memory {
    id: string;
    title: string;
    description: string;
    date: string;
    image_url: string;
    media_type: string;
    order_index: number;
}

interface Story {
    id: string;
    image_url: string;
    text_content: string;
    order_index: number;
    layout_type: 'text_overlay' | 'text_top' | 'text_bottom';
    zoom_level: number;
}

declare global {
    interface Window {
        google: any;
        gapi: any;
    }
}

// Helper to extract YouTube Video ID
const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function AdminPage() {
    // Tab State
    const [activeTab, setActiveTab] = useState<'memories' | 'stories'>('memories');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [hasReordered, setHasReordered] = useState(false);
    const [converting, setConverting] = useState(false);

    // Story State
    const [stories, setStories] = useState<Story[]>([]);
    const [storyEditingId, setStoryEditingId] = useState<string | null>(null);
    const [storyMediaFiles, setStoryMediaFiles] = useState<File[]>([]); // Changed to array for multiple uploads
    const [storyText, setStoryText] = useState("");
    const [storyLayoutType, setStoryLayoutType] = useState<'text_overlay' | 'text_top' | 'text_bottom'>('text_overlay');
    const [storyZoom, setStoryZoom] = useState(1.2);
    const [currentStoryImageUrl, setCurrentStoryImageUrl] = useState("");
    const [hasReorderedStories, setHasReorderedStories] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState("");
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Google Picker State
    const [importingFromGoogle, setImportingFromGoogle] = useState(false);

    // Media Input Type State
    const [mediaInputType, setMediaInputType] = useState<'upload' | 'youtube'>('upload');
    const [youtubeUrl, setYoutubeUrl] = useState("");

    const supabase = createClient();

    useEffect(() => {
        fetchMemories();
        fetchStories();
        loadGooglePickerScript();
    }, []);

    const fetchMemories = async () => {
        const { data } = await supabase.from('memorias').select('*').order('order_index', { ascending: true }).order('date', { ascending: false });
        if (data) setMemories(data as Memory[]);
    };

    const fetchStories = async () => {
        const { data } = await supabase.from('stories').select('*').order('order_index', { ascending: true });
        if (data) setStories(data as Story[]);
    };

    const handleReorder = (newOrder: Memory[]) => {
        setMemories(newOrder);
        setHasReordered(true);
    };

    const saveOrder = async () => {
        setLoading(true);
        try {
            const updates = memories.map((memory, index) => ({
                id: memory.id,
                order_index: index,
                title: memory.title,
            }));

            // Optimistic approach: Run all promises
            await Promise.all(updates.map(update =>
                supabase.from('memorias').update({ order_index: update.order_index }).eq('id', update.id)
            ));

            setHasReordered(false);
            alert("Ordem salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar ordem:", error);
            alert("Erro ao salvar ordem.");
        }
        setLoading(false);
    };

    const handleEdit = (memory: Memory) => {
        setEditingId(memory.id);
        setTitle(memory.title);
        setDate(memory.date);
        setDescription(memory.description || "");
        setCurrentImageUrl(memory.image_url);

        if (memory.media_type === 'youtube') {
            setMediaInputType('youtube');
            setYoutubeUrl(memory.image_url);
            setMediaFiles([]);
        } else {
            setMediaInputType('upload');
            setYoutubeUrl("");
            setMediaFiles([]);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setDate(new Date().toISOString().split('T')[0]);
        setCurrentImageUrl("");
        setMediaFiles([]);
        setYoutubeUrl("");
        setMediaInputType('upload');
        setSuccess(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta memória?")) return;

        setLoading(true);
        const { error } = await supabase.from('memorias').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir:', error);
            if (error.code === '42501' || error.message.includes('permission')) {
                alert('ERRO DE PERMISSÃO: Você precisa rodar o script SQL para permitir exclusão!\n\nVeja as instruções no chat.');
            } else {
                alert('Erro ao excluir: ' + error.message);
            }
        } else {
            await fetchMemories();
        }
        setLoading(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const convertedFiles: File[] = [];

            const hasHeic = files.some(f => f.name.toLowerCase().endsWith('.heic') || f.type === 'image/heic');

            if (hasHeic) {
                setConverting(true);
            }

            for (const file of files) {
                // Check if file is HEIC
                if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                    try {
                        console.log(`🔄 Converting ${file.name} from HEIC to JPG...`);

                        // Dynamically import heic2any
                        const heic2any = (await import('heic2any')).default;

                        // Convert HEIC to JPG
                        const convertedBlob = await heic2any({
                            blob: file,
                            toType: 'image/jpeg',
                            quality: 0.9
                        });

                        // Handle both single blob and array of blobs
                        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

                        // Create new File from blob
                        const newFileName = file.name.replace(/\.heic$/i, '.jpg');
                        const convertedFile = new File([blob], newFileName, { type: 'image/jpeg' });
                        convertedFiles.push(convertedFile);

                        console.log(`✅ Converted ${file.name} to JPG successfully!`);
                    } catch (error) {
                        console.error('Error converting HEIC:', error);
                        alert(`Erro ao converter ${file.name}. O arquivo será ignorado. Tente converter manualmente para JPG usando um site como heictojpg.com`);
                    }
                } else {
                    // Not HEIC, add as-is
                    convertedFiles.push(file);
                }
            }

            setConverting(false);
            setMediaFiles(convertedFiles);

            if (convertedFiles.length > 0) {
                console.log(`📁 ${convertedFiles.length} arquivo(s) prontos para upload`);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title) {
            alert("Por favor, preencha o título.");
            return;
        }

        if (!editingId) {
            if (mediaInputType === 'upload' && mediaFiles.length === 0) {
                alert("Por favor, selecione uma foto ou vídeo.");
                return;
            }
            if (mediaInputType === 'youtube' && !youtubeUrl) {
                alert("Por favor, insira o link do YouTube.");
                return;
            }
        }

        try {
            setLoading(true);
            setSuccess(false);

            let publicUrl = currentImageUrl;
            let mediaType = 'image';

            // IF Upload Mode AND Files exist
            if (mediaInputType === 'upload' && mediaFiles.length > 0) {
                // Loop through all selected files
                for (const file of mediaFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`; // Unique name
                    const filePath = `${fileName}`;
                    const isVideo = file.type.startsWith('video/');
                    const currentMediaType = isVideo ? 'video' : 'image';

                    const { error: uploadError } = await supabase.storage
                        .from('memorias')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('memorias')
                        .getPublicUrl(filePath);

                    const publicUrl = urlData.publicUrl;

                    // Insert each memory -> Default order_index = 0 (top)
                    const { error } = await supabase
                        .from('memorias')
                        .insert({
                            title,
                            description,
                            date,
                            image_url: publicUrl,
                            media_type: currentMediaType,
                            order_index: 0
                        });

                    if (error) throw error;
                }
            }
            // IF YouTube Mode AND URL exists
            else if (mediaInputType === 'youtube' && youtubeUrl) {
                publicUrl = youtubeUrl;
                mediaType = 'youtube';

                const { error } = await supabase
                    .from('memorias')
                    .insert({
                        title,
                        description,
                        date,
                        image_url: publicUrl,
                        media_type: mediaType,
                        order_index: 0
                    });

                if (error) throw error;
            }
            // IF Editing (Single Update)
            else if (editingId) {
                const { error } = await supabase
                    .from('memorias')
                    .update({
                        title,
                        description,
                        date,
                        image_url: publicUrl,
                        media_type: mediaType
                    })
                    .eq('id', editingId);

                if (error) throw error;
            }

            setSuccess(true);
            fetchMemories();

            // Clear form
            if (!editingId) {
                // Don't clear title/date to make multiple batches easier? 
                // Let's clear media but keep text for now or clear all.
                // User might want to change title. Let's clear title to be safe.
                setTitle("");
                setDescription("");
                setMediaFiles([]);
                setYoutubeUrl("");
                // Reset order might be weird if we just added to top
            } else {
                handleCancelEdit();
            }

        } catch (error: any) {
            console.error(error);
            alert("Erro ao salvar: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Google Drive Integration
    const loadGooglePickerScript = () => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.onload = () => {
            window.gapi.load("picker", () => {
                setImportingFromGoogle(false);
            });
        };
        document.body.appendChild(script);
    };

    // ==================== STORY HANDLERS ====================

    const handleReorderStories = (newOrder: Story[]) => {
        setStories(newOrder);
        setHasReorderedStories(true);
    };

    const saveStoryOrder = async () => {
        setLoading(true);
        try {
            await Promise.all(stories.map((story, index) =>
                supabase.from('stories').update({ order_index: index }).eq('id', story.id)
            ));
            setHasReorderedStories(false);
            alert("Ordem das histórias salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar ordem:", error);
            alert("Erro ao salvar ordem.");
        }
        setLoading(false);
    };

    const handleStoryEdit = (story: Story) => {
        setStoryEditingId(story.id);
        setStoryText(story.text_content || "");
        setStoryLayoutType(story.layout_type);
        setStoryZoom(story.zoom_level);
        setCurrentStoryImageUrl(story.image_url);
        setStoryMediaFiles([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStoryCancel = () => {
        setStoryEditingId(null);
        setStoryText("");
        setStoryLayoutType('text_overlay');
        setStoryZoom(1.2);
        setCurrentStoryImageUrl("");
        setStoryMediaFiles([]);
    };

    const handleStoryDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta história?")) return;
        setLoading(true);
        const { error } = await supabase.from('stories').delete().eq('id', id);
        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            await fetchStories();
        }
        setLoading(false);
    };

    const handleStoryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const convertedFiles: File[] = [];

            const hasHeic = files.some(f => f.name.toLowerCase().endsWith('.heic') || f.type === 'image/heic');
            if (hasHeic) setConverting(true);

            for (const file of files) {
                // Check if HEIC
                if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                    try {
                        const heic2any = (await import('heic2any')).default;
                        const convertedBlob = await heic2any({
                            blob: file,
                            toType: 'image/jpeg',
                            quality: 0.9
                        });
                        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                        const newFileName = file.name.replace(/\.heic$/i, '.jpg');
                        const convertedFile = new File([blob], newFileName, { type: 'image/jpeg' });
                        convertedFiles.push(convertedFile);
                    } catch (error) {
                        console.error('Error converting HEIC:', error);
                        alert(`Erro ao converter ${file.name}. Tente um JPG ou PNG.`);
                    }
                } else {
                    convertedFiles.push(file);
                }
            }

            setConverting(false);
            setStoryMediaFiles(convertedFiles);
        }
    };

    const handleStorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!storyText) {
            alert("Por favor, adicione um texto para a história.");
            return;
        }

        if (!storyEditingId && storyMediaFiles.length === 0) {
            alert("Por favor, selecione pelo menos uma imagem.");
            return;
        }

        try {
            setLoading(true);

            // If editing, update the single story
            if (storyEditingId) {
                let publicUrl = currentStoryImageUrl;

                // Upload new image if selected
                if (storyMediaFiles.length > 0) {
                    const file = storyMediaFiles[0]; // Use first file for editing
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('memorias')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('memorias')
                        .getPublicUrl(filePath);

                    publicUrl = urlData.publicUrl;
                }

                const { error } = await supabase
                    .from('stories')
                    .update({
                        image_url: publicUrl,
                        text_content: storyText,
                        layout_type: storyLayoutType,
                        zoom_level: storyZoom
                    })
                    .eq('id', storyEditingId);

                if (error) throw error;
            } else {
                // Create one story for each image
                for (const file of storyMediaFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('memorias')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('memorias')
                        .getPublicUrl(filePath);

                    const publicUrl = urlData.publicUrl;

                    // Insert story
                    const { error } = await supabase
                        .from('stories')
                        .insert({
                            image_url: publicUrl,
                            text_content: storyText,
                            layout_type: storyLayoutType,
                            zoom_level: storyZoom,
                            order_index: 0
                        });

                    if (error) throw error;
                }
            }

            setSuccess(true);
            fetchStories();
            handleStoryCancel();

        } catch (error: any) {
            console.error('Erro completo:', error);
            console.error('Mensagem:', error.message);
            console.error('Detalhes:', error.details);
            console.error('Hint:', error.hint);
            alert("Erro ao salvar história: " + (error.message || JSON.stringify(error)));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 pb-32">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-2">Painel de Memórias</h1>
                        <p className="text-slate-400 text-sm">Gerencie suas fotos e vídeos</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="/" className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors border border-slate-800 rounded-full hover:border-slate-600">
                            Ver Site
                        </a>
                        <button onClick={() => logout()} className="px-4 py-2 text-sm bg-slate-100 text-slate-900 rounded-full font-medium hover:bg-white transition-colors flex items-center gap-2">
                            <LogOut size={16} /> Sair
                        </button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit">
                    <button
                        onClick={() => setActiveTab('memories')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                            activeTab === 'memories'
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <ImageIcon size={18} />
                        Memórias ({memories.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('stories')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                            activeTab === 'stories'
                                ? "bg-purple-600 text-white shadow-lg"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        <BookOpen size={18} />
                        Narrativas ({stories.length})
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'memories' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Form */}
                        <div className="space-y-6">
                            <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6 sticky top-8">

                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Título *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-serif text-lg"
                                        placeholder="Ex: Nossa Viagem para Praia"
                                        required
                                    />
                                </div>

                                {/* Date Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data do Evento</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                {/* Media Type Toggle */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Foto/Vídeo ou YouTube *</label>

                                    <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg mb-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMediaInputType('upload');
                                                setYoutubeUrl("");
                                                setMediaFiles([]);
                                            }}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                                                mediaInputType === 'upload' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-700"
                                            )}
                                        >
                                            <Upload size={16} /> Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMediaInputType('youtube');
                                                setMediaFiles([]);
                                            }}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                                                mediaInputType === 'youtube' ? "bg-red-600 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-700"
                                            )}
                                        >
                                            <Youtube size={16} /> YouTube
                                        </button>
                                    </div>

                                    {/* Media Input Area */}
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative group",
                                            mediaFiles.length > 0 ? "border-green-500/50 bg-green-500/10" : "border-slate-700 hover:border-indigo-500 hover:bg-slate-800/30",
                                            mediaInputType === 'youtube' ? "hidden" : ""
                                        )}
                                        onClick={() => document.getElementById('media-upload')?.click()}
                                    >
                                        <input
                                            type="file"
                                            id="media-upload"
                                            className="hidden"
                                            accept="image/*,video/*"
                                            multiple
                                            onChange={handleFileChange}
                                            required={!editingId && mediaInputType === 'upload' && mediaFiles.length === 0}
                                        />
                                        <div className="space-y-2">
                                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                {converting ? (
                                                    <div className="animate-spin text-yellow-500">⏳</div>
                                                ) : mediaFiles.length > 0 ? (
                                                    <CheckCircle className="text-green-500" />
                                                ) : (
                                                    <ImagePlus className="text-slate-400" />
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium">
                                                {converting ? "Convertendo HEIC para JPG..." : mediaFiles.length > 0 ? `${mediaFiles.length} arquivos prontos` : "Clique para selecionar fotos ou vídeos"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Suporta: JPG, PNG, GIF, MP4
                                            </p>
                                        </div>
                                    </div>

                                    {/* YouTube Input Area */}
                                    {mediaInputType === 'youtube' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Link do YouTube</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                                    <Link size={16} />
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    value={youtubeUrl}
                                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                                                    required={mediaInputType === 'youtube'}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 pl-1">
                                                Cole o link completo do vídeo (ex: https://youtube.com/watch?v=...)
                                            </p>

                                            {/* Video Preview */}
                                            {youtubeUrl && getYoutubeId(youtubeUrl) && (
                                                <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-black shadow-lg border border-slate-700">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                                                        title="YouTube video player"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {currentImageUrl && mediaFiles.length === 0 && (
                                        <p className="text-xs text-slate-500 mt-2">Mídia atual preservada. Escolha novo arquivo para substituir.</p>
                                    )}
                                </div>

                                {/* Description Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Descrição (Opcional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[100px]"
                                        placeholder="Escreva algo especial sobre esse momento..."
                                    />
                                </div>

                                {/* Actions */}
                                <div className="pt-4 flex gap-3">
                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-white text-slate-950 hover:bg-indigo-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <>{editingId ? <Save size={18} /> : (mediaInputType === 'youtube' ? <Youtube size={18} /> : <Save size={18} />)}
                                                {editingId ? 'Atualizar' : (mediaInputType === 'youtube' ? 'Adicionar Vídeo à Tela' : 'Criar Memória')}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column: List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                                    <span className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg">
                                        <Edit size={20} />
                                    </span>
                                    Memórias ({memories.length})
                                </h2>
                                {hasReordered && (
                                    <button
                                        onClick={saveOrder}
                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors animate-pulse"
                                    >
                                        Salvar Ordem
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[800px] pr-2">
                                <Reorder.Group axis="y" values={memories} onReorder={handleReorder} className="space-y-3">
                                    {memories.map((memory) => (
                                        <Reorder.Item key={memory.id} value={memory}>
                                            <div
                                                className={cn(
                                                    "group relative flex gap-4 p-3 rounded-xl border transition-all cursor-move bg-slate-900/50 border-slate-800 hover:border-slate-700",
                                                    editingId === memory.id ? "border-indigo-500 bg-indigo-500/5" : ""
                                                )}
                                            >
                                                {/* Drag Handle Indicator */}
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ⋮⋮
                                                </div>

                                                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-950 items-center justify-center flex ml-4">
                                                    {memory.media_type === 'video' ? (
                                                        <video src={memory.image_url} className="w-full h-full object-cover opacity-50" />
                                                    ) : memory.media_type === 'youtube' ? (
                                                        <img
                                                            src={`https://img.youtube.com/vi/${getYoutubeId(memory.image_url)}/0.jpg`}
                                                            className="w-full h-full object-cover opacity-50"
                                                            alt="YouTube thumb"
                                                        />
                                                    ) : (
                                                        <img src={memory.image_url} alt={memory.title} className="w-full h-full object-cover" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 py-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="font-medium text-white truncate pr-2">{memory.title}</h3>
                                                        <span className="text-xs font-mono text-slate-500 shrink-0">{memory.date.split('-').reverse().join('/')}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 line-clamp-2 mt-1">{memory.description}</p>

                                                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(memory); }}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(memory.id); }}
                                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>

                                {memories.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ImagePlus className="text-slate-500" />
                                        </div>
                                        <p className="text-slate-400">Nenhuma memória criada.</p>
                                        <p className="text-xs text-slate-500 mt-1">Use o formulário para adicionar a primeira.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stories Tab Content */}
                {activeTab === 'stories' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Story Form */}
                        <div className="space-y-6">
                            <form onSubmit={handleStorySubmit} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6 sticky top-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Imagem *</label>
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative group",
                                            storyMediaFiles.length > 0 ? "border-green-500/50 bg-green-500/10" : "border-slate-700 hover:border-purple-500 hover:bg-slate-800/30"
                                        )}
                                        onClick={() => document.getElementById('story-image-upload')?.click()}
                                    >
                                        <input
                                            type="file"
                                            id="story-image-upload"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleStoryFileChange}
                                            required={!storyEditingId && storyMediaFiles.length === 0}
                                        />
                                        <div className="space-y-2">
                                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                {converting ? (
                                                    <div className="animate-spin text-yellow-500">⏳</div>
                                                ) : storyMediaFiles.length > 0 ? (
                                                    <CheckCircle className="text-green-500" />
                                                ) : (
                                                    <ImagePlus className="text-slate-400" />
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium">
                                                {converting ? "Convertendo..." : storyMediaFiles.length > 0 ? `${storyMediaFiles.length} ${storyMediaFiles.length === 1 ? 'imagem selecionada' : 'imagens selecionadas'}` : "Clique para selecionar imagens"}
                                            </p>
                                            <p className="text-xs text-slate-500">PNG, JPG otimizados para scrolling</p>
                                        </div>
                                    </div>
                                    {currentStoryImageUrl && storyMediaFiles.length === 0 && (
                                        <p className="text-xs text-slate-500 mt-2">Imagem atual preservada. Escolha nova para substituir.</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Texto *</label>
                                    <textarea
                                        value={storyText}
                                        onChange={(e) => setStoryText(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all min-h-[120px]"
                                        placeholder="Conte uma história sobre essa imagem..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Layout do Texto</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'text_overlay', label: 'Sobreposto' },
                                            { value: 'text_top', label: 'Acima' },
                                            { value: 'text_bottom', label: 'Abaixo' }
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setStoryLayoutType(option.value as any)}
                                                className={cn(
                                                    "py-2 px-3 rounded-lg text-xs font-medium transition-all",
                                                    storyLayoutType === option.value
                                                        ? "bg-purple-600 text-white"
                                                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Zoom: {storyZoom.toFixed(1)}x
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="2"
                                        step="0.1"
                                        value={storyZoom}
                                        onChange={(e) => setStoryZoom(parseFloat(e.target.value))}
                                        className="w-full accent-purple-600"
                                    />
                                    <p className="text-xs text-slate-500">Define o nível de zoom da imagem ao rolar</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    {storyEditingId && (
                                        <button
                                            type="button"
                                            onClick={handleStoryCancel}
                                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-purple-600 text-white hover:bg-purple-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <><Save size={18} /> {storyEditingId ? 'Atualizar' : 'Adicionar à Narrativa'}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Story List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                                    <span className="bg-purple-500/10 text-purple-400 p-2 rounded-lg">
                                        <BookOpen size={20} />
                                    </span>
                                    Narrativas ({stories.length})
                                </h2>
                                {hasReorderedStories && (
                                    <button
                                        onClick={saveStoryOrder}
                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors animate-pulse"
                                    >
                                        Salvar Ordem
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[800px] pr-2">
                                <Reorder.Group axis="y" values={stories} onReorder={handleReorderStories} className="space-y-3">
                                    {stories.map((story) => (
                                        <Reorder.Item key={story.id} value={story}>
                                            <div
                                                className={cn(
                                                    "group relative flex gap-4 p-3 rounded-xl border transition-all cursor-move bg-slate-900/50 border-slate-800 hover:border-slate-700",
                                                    storyEditingId === story.id ? "border-purple-500 bg-purple-500/5" : ""
                                                )}
                                            >
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ⋮⋮
                                                </div>

                                                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-950 items-center justify-center flex ml-4">
                                                    <img src={story.image_url} alt="" className="w-full h-full object-cover" />
                                                </div>

                                                <div className="flex-1 min-w-0 py-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm text-slate-300 line-clamp-2">{story.text_content}</p>
                                                    </div>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">
                                                            {story.layout_type === 'text_overlay' ? 'Sobreposto' : story.layout_type === 'text_top' ? 'Acima' : 'Abaixo'}
                                                        </span>
                                                        <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">
                                                            Zoom {story.zoom_level}x
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStoryEdit(story); }}
                                                            className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-md transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleStoryDelete(story.id); }}
                                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>

                                {stories.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BookOpen className="text-slate-500" />
                                        </div>
                                        <p className="text-slate-400">Nenhuma narrativa criada.</p>
                                        <p className="text-xs text-slate-500 mt-1">Crie sua primeira história visual!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
