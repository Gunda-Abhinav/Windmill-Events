-- Migration: Create event_banners table for storing event banner images
-- Stores banner images as binary data (bytea) with metadata

CREATE TABLE IF NOT EXISTS event_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to events table
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  
  -- Image data
  image_data BYTEA NOT NULL, -- Binary image data
  image_type TEXT NOT NULL, -- MIME type (e.g., 'image/jpeg', 'image/png', 'image/webp')
  image_size INTEGER NOT NULL, -- Size in bytes
  
  -- Image metadata
  width INTEGER, -- Image width in pixels (optional)
  height INTEGER, -- Image height in pixels (optional)
  alt_text TEXT, -- Alt text for accessibility
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one banner per event
  CONSTRAINT unique_event_banner UNIQUE (event_id)
);

-- Create index on event_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_event_banners_event_id ON event_banners(event_id);

-- Add comment to table
COMMENT ON TABLE event_banners IS 'Stores event banner images as binary data';
COMMENT ON COLUMN event_banners.image_data IS 'Binary image data stored as bytea';
COMMENT ON COLUMN event_banners.image_type IS 'MIME type of the image (e.g., image/jpeg, image/png)';
COMMENT ON COLUMN event_banners.alt_text IS 'Alternative text for accessibility';

