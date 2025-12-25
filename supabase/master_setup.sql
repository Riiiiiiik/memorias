-- 🧙‍♂️ SCRIPT MESTRE - BIBLIOTECA DE MEMÓRIAS
-- Rode este script no SQL Editor do Supabase para configurar TUDO de uma vez.

-- 1. Cria a tabela de memórias (se não existir)
CREATE TABLE IF NOT EXISTS public.memorias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  date date DEFAULT current_date,
  image_url text NOT NULL,
  audio_url text, 
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Adiciona coluna de Vídeo (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='memorias' AND column_name='media_type') THEN
        ALTER TABLE public.memorias ADD COLUMN media_type text DEFAULT 'image';
    END IF;
END $$;

-- 3. Habilita RLS (Segurança)
ALTER TABLE public.memorias ENABLE ROW LEVEL SECURITY;

-- 4. Cria Bucket de Armazenamento 'memorias' (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('memorias', 'memorias', true)
ON CONFLICT (id) DO NOTHING;

-- 5. POLICIES (PERMISSÕES) - TABELA DE DADOS
-- Remove policies antigas para evitar duplicidade
DROP POLICY IF EXISTS "Qualquer um pode ver memórias" ON public.memorias;
DROP POLICY IF EXISTS "Qualquer um pode inserir memórias" ON public.memorias;

-- Permite leitura pública
CREATE POLICY "Qualquer um pode ver memórias"
ON public.memorias FOR SELECT
USING (true);

-- Permite INSERÇÃO pública (Para facilitar o admin sem login)
CREATE POLICY "Qualquer um pode inserir memórias"
ON public.memorias FOR INSERT
WITH CHECK (true);

-- 6. POLICIES (PERMISSÕES) - STORAGE (ARQUIVOS)
DROP POLICY IF EXISTS "Imagens Públicas" ON storage.objects;
DROP POLICY IF EXISTS "Upload Público" ON storage.objects;

-- Permite ver arquivos
CREATE POLICY "Imagens Públicas"
ON storage.objects FOR SELECT
USING ( bucket_id = 'memorias' );

-- Permite upload de arquivos
CREATE POLICY "Upload Público"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'memorias' );

-- Permite remover memórias
CREATE POLICY "Qualquer um pode excluir memórias"
ON public.memorias FOR DELETE
USING (true);

-- Permite atualizar memórias
CREATE POLICY "Qualquer um pode atualizar memórias"
ON public.memorias FOR UPDATE
USING (true)
WITH CHECK (true);

-- FIM! 🎉
