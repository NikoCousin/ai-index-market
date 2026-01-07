-- Drop existing table if it exists (safe for development/testing)
-- Remove this line if you have important data you want to keep
DROP TABLE IF EXISTS news CASCADE;

-- Create news table
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  image_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on published_at for efficient sorting/filtering
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);

-- Create index on source_domain for filtering
CREATE INDEX IF NOT EXISTS idx_news_source_domain ON news(source_domain);

-- Create GIN index on tags array for efficient tag filtering
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read (SELECT)
CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert
-- NOTE: If you want ONLY you (specific user) to insert, replace auth.role() 
-- with a specific user ID check like: auth.uid() = 'your-user-id-here'
CREATE POLICY "Only authenticated users can insert news"
  ON news
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Insert dummy data for testing
INSERT INTO news (title, summary, image_url, source_url, source_domain, published_at, tags) VALUES
(
  'OpenAI Unveils GPT-5 with Multimodal Reasoning Capabilities',
  'OpenAI has announced GPT-5, their most advanced language model yet, featuring breakthrough multimodal reasoning that can process text, images, and audio simultaneously. Early testers report significant improvements in complex problem-solving and creative tasks.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
  'https://techcrunch.com/2024/openai-gpt-5-announcement',
  'techcrunch.com',
  NOW() - INTERVAL '2 days',
  ARRAY['AI', 'OpenAI', 'GPT-5', 'Machine Learning', 'Technology']
),
(
  'Anthropic Raises $4B Series C to Accelerate Claude Development',
  'Anthropic has secured a massive $4 billion Series C funding round led by Amazon and Google Ventures. The funding will be used to scale Claude''s infrastructure and expand its enterprise capabilities, positioning it as a major competitor in the AI assistant market.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
  'https://www.theverge.com/2024/anthropic-funding-round',
  'theverge.com',
  NOW() - INTERVAL '5 days',
  ARRAY['AI', 'Anthropic', 'Claude', 'Funding', 'Enterprise']
),
(
  'Google DeepMind''s AlphaFold 3 Predicts Protein Interactions with 90% Accuracy',
  'Google DeepMind has released AlphaFold 3, a revolutionary AI system that can predict how proteins interact with DNA, RNA, and other molecules with unprecedented accuracy. The breakthrough could accelerate drug discovery and advance our understanding of biological processes.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop&auto=format',
  'https://www.nature.com/articles/alphafold3-release',
  'nature.com',
  NOW() - INTERVAL '1 week',
  ARRAY['AI', 'DeepMind', 'AlphaFold', 'Science', 'Biology', 'Research']
);

