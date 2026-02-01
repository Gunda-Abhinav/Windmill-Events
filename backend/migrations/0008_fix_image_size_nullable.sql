-- Migration: Fix image_size column to be nullable
-- The image_size column in event_banners was NOT NULL, but it's not critical
-- for functionality since the image data is already stored. Making it nullable
-- allows for more flexible banner uploads.

-- Alter the image_size column to allow NULL values
ALTER TABLE event_banners
ALTER COLUMN image_size DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN event_banners.image_size IS 'Size in bytes (optional - can be calculated from image_data if needed)';

