-- Alternative: If you want to preserve existing data, use this instead
-- This adds the missing column if it doesn't exist

-- Add source_domain column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'source_domain'
  ) THEN
    ALTER TABLE news ADD COLUMN source_domain TEXT;
    -- Update existing rows with a default value (extract domain from source_url if it exists)
    UPDATE news 
    SET source_domain = substring(source_url from 'https?://([^/]+)')
    WHERE source_domain IS NULL AND source_url IS NOT NULL;
    -- Make it NOT NULL after populating
    ALTER TABLE news ALTER COLUMN source_domain SET NOT NULL;
  END IF;
END $$;

-- Create index on source_domain if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_news_source_domain ON news(source_domain);

