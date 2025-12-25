import { createClient } from "@/lib/supabase/server";
import { Memory } from "@/components/carousel/memory-card";
import PrismaticBurst from "@/components/ui/PrismaticBurst";
import { EditableText } from "@/components/ui/editable-text";
import { getSiteContent } from "@/app/actions/content";
import { PageContent } from "@/components/page-content";
import { OptionsMenuWithReason } from "@/components/ui/options-menu-with-reason";

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

  return (
    <main className="relative min-h-screen bg-black">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2}
          speed={0.5}
          distort={1.0}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.25}
          rayCount={24}
          mixBlendMode="lighten"
          colors={['#ff007a', '#4d3dff', '#ffffff']}
        />
      </div>

      {/* Page Content with Draggable Sections */}
      <PageContent
        initialMemories={displayMemories}
        content={content}
        hasRealMemories={!!realMemories?.length}
      />

      {/* FOOTER */}
      <footer className="relative z-10 py-12 text-center text-white/30 text-sm pb-20 max-w-5xl mx-auto">
        <EditableText
          contentKey="footer_text"
          initialValue={content.footer_text || `Feito com todo o meu amor © ${new Date().getFullYear()}`}
          as="p"
        />
        <div className="mt-4">
          <a href="/admin" className="text-white/10 hover:text-white/40 transition-colors p-2 text-xs uppercase tracking-widest">
            Admin Area
          </a>
        </div>
      </footer>
    </main>
  );
}
