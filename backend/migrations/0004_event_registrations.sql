-- Migration: add event_registrations table
-- This stores registrations submitted from /events/<event>/register

-- Ensure UUID generator exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Snapshot of event details at the time of registration
  event_title text NOT NULL,
  event_date date,
  venue text,
  contact_name text,
  contact_phone text,
  contact_email text,

  -- Registrant details
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  passes int NOT NULL,

  -- Pricing snapshot (server-computed)
  price_per_pass numeric(10,2) NOT NULL,
  total_amount numeric(10,2) NOT NULL,

  liability_accepted boolean NOT NULL,

  -- Audit/debug
  raw_payload jsonb,
  ip text,
  user_agent text,

  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_title ON event_registrations(event_title);
