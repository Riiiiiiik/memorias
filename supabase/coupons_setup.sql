-- Create the coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🎁',
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read coupons
CREATE POLICY "Allow public read access to coupons"
  ON coupons
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to update coupons (for redemption)
CREATE POLICY "Allow public update access to coupons"
  ON coupons
  FOR UPDATE
  USING (true);

-- Insert seed data
INSERT INTO coupons (title, description, emoji) VALUES
  ('Massagem nas Costas', 'Vale uma massagem relaxante de 15 minutos', '💆'),
  ('Escolher o Filme', 'Vale escolher o filme hoje (sem eu reclamar)', '🎬'),
  ('Jantar Especial', 'Vale um jantar onde você quiser', '🍽️'),
  ('Café da Manhã na Cama', 'Vale um café da manhã especial servido na cama', '☕'),
  ('Dia Livre de Tarefas', 'Vale um dia sem precisar fazer nenhuma tarefa doméstica', '🏖️');
