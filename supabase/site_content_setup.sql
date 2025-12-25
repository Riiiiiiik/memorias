-- Create table for storing dynamic site content
CREATE TABLE IF NOT EXISTS site_content (
    key text PRIMARY KEY,
    value text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create policies (Public read, Anon update for demo purposes - or authenticated only ideally)
-- Allowing anon update for now to allow easier editing as requested, 
-- but ideally should be restricted to admin. 
-- Given the context, I'll allow public update to make "click and edit" work seamlessly without login if that's the user's flow, 
-- or I'll assume they are the admin. Let's start with public update for smooth demo.

CREATE POLICY "Allow public read access"
ON site_content FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public update access"
ON site_content FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public insert access"
ON site_content FOR INSERT
TO public
WITH CHECK (true);

-- Insert initial values
INSERT INTO site_content (key, value)
VALUES 
    ('home_title', 'Nossas Memórias'),
    ('home_subtitle', 'Arraste para relembrar'),
    ('dedication_title', 'Para o meu amor,'),
    ('dedication_p1', 'Criei este cantinho digital para guardarmos os momentos que fizeram nosso mundo parar.'),
    ('dedication_p2', 'Cada foto aqui é um capítulo da nossa história favorita. Que possamos continuar escrevendo (e fotografando) muitos outros momentos juntos.'),
    ('footer_text', 'Feito com ❤️ por [Seu Nome]')
ON CONFLICT (key) DO NOTHING;
