-- 📖 SETUP PARA PARALLAX SCROLLYTELLING (NARRATIVA VISUAL)
-- Rode este script no SQL Editor do Supabase

-- 1. Cria a tabela de stories (se não existir)
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  text_content text,
  order_index integer DEFAULT 0,
  layout_type text DEFAULT 'text_overlay', -- 'text_overlay', 'text_top', 'text_bottom'
  zoom_level float DEFAULT 1.2, -- Controle do zoom (1.0 = sem zoom, 1.5 = 150%)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilita RLS (Segurança)
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES (PERMISSÕES) - TABELA DE DADOS
-- Remove policies antigas para evitar duplicidade
DROP POLICY IF EXISTS "Qualquer um pode ver stories" ON public.stories;
DROP POLICY IF EXISTS "Qualquer um pode inserir stories" ON public.stories;
DROP POLICY IF EXISTS "Qualquer um pode excluir stories" ON public.stories;
DROP POLICY IF EXISTS "Qualquer um pode atualizar stories" ON public.stories;

-- Permite leitura pública
CREATE POLICY "Qualquer um pode ver stories"
ON public.stories FOR SELECT
USING (true);

-- Permite INSERÇÃO pública (Para facilitar o admin sem login)
CREATE POLICY "Qualquer um pode inserir stories"
ON public.stories FOR INSERT
WITH CHECK (true);

-- Permite remover stories
CREATE POLICY "Qualquer um pode excluir stories"
ON public.stories FOR DELETE
USING (true);

-- Permite atualizar stories
CREATE POLICY "Qualquer um pode atualizar stories"
ON public.stories FOR UPDATE
USING (true)
WITH CHECK (true);

-- FIM! 🎉
