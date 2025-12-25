import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { Memory } from "@/components/carousel/memory-card";
import { getSiteContent } from "@/app/actions/content";
import { MobileAppShell } from "@/app/components/MobileAppShell";

// Demo Data (Fallback)
const DEMO_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Bem-vindo à Biblioteca',
    date: 'Hoje',
    description: 'Esta é uma memória de exemplo. Adicione suas fotos no Supabase!',
    imageUrl: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Exemplo de Viagem',
    date: 'Férias 2024',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop'
  },
];

export default async function Home() {
  const supabase = await createClient();
  const content = await getSiteContent();

  // Fetch Real Memories
  const { data: realMemories, error } = await supabase
    .from("memorias")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Erro ao buscar memórias:", error);
  }

  // Fetch Stories for Parallax Scrollytelling
  const { data: realStories, error: storiesError } = await supabase
    .from("stories")
    .select("*")
    .order("order_index", { ascending: true });

  if (storiesError) {
    console.error("Erro ao buscar stories:", storiesError);
  }

  // Use real data if available, otherwise show demo
  const displayMemories = (realMemories && realMemories.length > 0)
    ? realMemories.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      date: new Date(m.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
      imageUrl: m.image_url,
      mediaType: m.media_type as 'image' | 'video' | 'youtube'
    }))
    : DEMO_MEMORIES;

  const displayStories = realStories || [];

  return (
    <MobileAppShell
      initialMemories={displayMemories}
      content={content}
      hasRealMemories={!!realMemories?.length}
      stories={displayStories}
    />
  );
}
