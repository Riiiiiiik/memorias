-- Adiciona coluna de ordem (se não existir)
ALTER TABLE public.memorias 
ADD COLUMN IF NOT EXISTS order_index BIGINT;

-- Inicializa a ordem baseada na data atual (para memórias existentes)
-- Defino um valor alto padrão para novas inserções (opcional) ou uso logic backend
-- Aqui, vamos inicializar usando um timestamp negativo (para os mais novos ficarem em cima se ordenado ASC)
-- OU timestamp positivo.
-- Vamos usar: menor order_index = aparece primeiro (topo).
-- Atualmente o site mostra: mais recente primeiro.
-- Então vamos definir order_index baseado na data invertida ou apenas preencher com 0, 1, 2...

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY date DESC, created_at DESC) as rn
  FROM public.memorias
)
UPDATE public.memorias
SET order_index = numbered.rn
FROM numbered
WHERE public.memorias.id = numbered.id;

-- Garante que futuras inserções tenham um default (opcional, mas melhor tratar no código)
-- Mas podemos setar default 0.
ALTER TABLE public.memorias ALTER COLUMN order_index SET DEFAULT 0;
