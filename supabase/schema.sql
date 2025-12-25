-- 📸 Tabela de Memórias
-- Armazena os "cards" que aparecem no carrossel

create table if not exists memorias (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date default current_date,
  image_url text not null,
  color text, -- Para customizar a cor do card futuramente
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 🔒 RLS Policies (Segurança)
alter table memorias enable row level security;

-- Permitir leitura pública (qualquer um pode ver as memórias)
-- Ideal para uma landing page de presente
create policy "Qualquer um pode ver memórias"
  on memorias for select
  using (true);

-- Permitir apenas o dono (você) inserir/editar
-- (Isso requer que você esteja logado no dashboard do supabase ou implemente login)
-- Por simplicidade inicial, vamos deixar aberto para leitura e fechado para escrita via API pública
-- Insira os dados via Dashboard do Supabase

-- 🗃️ Storage Bucket
-- Você precisará criar um bucket chamado 'memorias' no Supabase Storage
-- e marcá-lo como "Public Bucket"
