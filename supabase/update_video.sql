-- 🎥 Atualização para Suporte a Vídeo
-- Adiciona coluna para identificar o tipo de mídia

ALTER TABLE memorias 
ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'image';

-- Comentário: 'image' ou 'video'

-- Se quiser garantir integridade:
-- ALTER TABLE memorias ADD CONSTRAINT check_media_type CHECK (media_type IN ('image', 'video'));
