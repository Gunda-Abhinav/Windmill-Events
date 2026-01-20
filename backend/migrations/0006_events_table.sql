-- Migration: Create events table with pricing and early bird support
-- This table stores all event information including pricing, dates, and venue details

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event basic information
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier (e.g., 'hearts-and-beats')
  description TEXT,
  
  -- Event date and venue
  event_date TIMESTAMPTZ NOT NULL,
  event_end_date TIMESTAMPTZ, -- Optional end date/time for multi-day events
  registration_deadline TIMESTAMPTZ, -- Deadline after which event should not be shown/registrations closed
  venue TEXT NOT NULL,
  venue_address TEXT,
  
  -- Pricing information
  regular_price DECIMAL(10, 2) NOT NULL, -- Regular price per pass
  early_bird_price DECIMAL(10, 2), -- Early bird price per pass (optional)
  early_bird_deadline TIMESTAMPTZ, -- Deadline for early bird pricing (optional)
  
  -- Event capacity and availability
  max_capacity INTEGER, -- Maximum number of attendees (optional)
  available_passes INTEGER, -- Current available passes (optional)
  
  -- Event status
  status TEXT NOT NULL DEFAULT 'active', -- active, sold_out, cancelled, completed
  is_published BOOLEAN NOT NULL DEFAULT true, -- Whether event is visible on website
  
  -- Contact information (for event organizer)
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Create index on event_date for sorting
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- Create index on status and is_published for filtering active events
CREATE INDEX IF NOT EXISTS idx_events_status_published ON events(status, is_published);

-- Insert the existing "Hearts and Beats" event
INSERT INTO events (
  title,
  slug,
  description,
  event_date,
  event_end_date,
  registration_deadline,
  venue,
  venue_address,
  regular_price,
  early_bird_price,
  early_bird_deadline,
  status,
  is_published,
  contact_name,
  contact_email,
  contact_phone
) VALUES (
  'Hearts and Beats',
  'hearts-and-beats',
  'Join us for an unforgettable Valentine''s Day celebration filled with music, dance, and romance. Experience the magic of love with live performances, DJ sets, and special surprises throughout the night.',
  '2026-02-14 18:00:00-08:00', -- February 14, 2026, 6:00 PM PST
  '2026-02-15 02:00:00-08:00', -- Event ends Feb 15, 2026, 2:00 AM PST
  '2026-02-14 12:00:00-08:00', -- Registration closes Feb 14, 2026, 12:00 PM PST (6 hours before event)
  'Hill View Hall',
  'Hill View Hall, Dublin, CA',
  60.00, -- Regular price
  50.00, -- Early bird price
  '2026-02-01 23:59:59-08:00', -- Early bird deadline: Feb 1, 2026
  'active',
  true,
  'Windmill Events Team',
  'contact@windmill-events.com',
  NULL
) ON CONFLICT (slug) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE events IS 'Stores all event information including pricing, dates, and venue details';
COMMENT ON COLUMN events.slug IS 'URL-friendly identifier used in event URLs';
COMMENT ON COLUMN events.event_end_date IS 'Optional end date/time for multi-day events';
COMMENT ON COLUMN events.registration_deadline IS 'Deadline after which event should not be shown on UI and registrations are closed';
COMMENT ON COLUMN events.early_bird_price IS 'Optional early bird price - if NULL, no early bird pricing';
COMMENT ON COLUMN events.early_bird_deadline IS 'Deadline for early bird pricing - if NULL, no early bird pricing';
COMMENT ON COLUMN events.status IS 'Event status: active, sold_out, cancelled, completed';

