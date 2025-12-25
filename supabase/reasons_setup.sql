-- Tabela de Motivos
CREATE TABLE IF NOT EXISTS public.motivos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  texto text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.motivos ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Qualquer um pode ver motivos" ON public.motivos;
CREATE POLICY "Qualquer um pode ver motivos"
ON public.motivos FOR SELECT
USING (true);

-- Permite inserção apenas para facilitar (idealmente seria restrito, mas mantendo simples como o resto)
DROP POLICY IF EXISTS "Qualquer um pode inserir motivos" ON public.motivos;
CREATE POLICY "Qualquer um pode inserir motivos"
ON public.motivos FOR INSERT
WITH CHECK (true);

-- Seed Initial Data (Only if empty)
INSERT INTO public.motivos (texto)
SELECT 'Porque você faz o melhor café.'
WHERE NOT EXISTS (SELECT 1 FROM public.motivos WHERE texto = 'Porque você faz o melhor café.');

INSERT INTO public.motivos (texto)
SELECT 'Pelo jeito que você ri dos meus bugs no código.'
WHERE NOT EXISTS (SELECT 1 FROM public.motivos WHERE texto = 'Pelo jeito que você ri dos meus bugs no código.');

INSERT INTO public.motivos (texto)
SELECT 'Porque você me apoia nos meus projetos.'
WHERE NOT EXISTS (SELECT 1 FROM public.motivos WHERE texto = 'Porque você me apoia nos meus projetos.');

INSERT INTO public.motivos (texto)
SELECT 'Porque você me entende mesmo quando eu não digo nada.'
WHERE NOT EXISTS (SELECT 1 FROM public.motivos WHERE texto = 'Porque você me entende mesmo quando eu não digo nada.');

INSERT INTO public.motivos (texto)
SELECT 'Pelo seu cheiro que me acalma.'
WHERE NOT EXISTS (SELECT 1 FROM public.motivos WHERE texto = 'Pelo seu cheiro que me acalma.');
