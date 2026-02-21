-- Migration: Create Enquiry table
CREATE TABLE IF NOT EXISTS "Enquiry" (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_type text NOT NULL,
  event_date text,
  message text NOT NULL,
  ip text,
  user_agent text,
  email_sent boolean NOT NULL DEFAULT false,
  email_sent_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_enquiry_email ON "Enquiry"(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_enquiry_created_at ON "Enquiry"(created_at DESC);

