-- 0001_init migration
-- Creates the Enquiry table matching prisma/schema.prisma

CREATE TABLE IF NOT EXISTS "Enquiry" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NULL,
  event_type text NOT NULL,
  event_date text NULL,
  message text NOT NULL,
  ip text NULL,
  user_agent text NULL,
  email_sent boolean NOT NULL DEFAULT false,
  email_sent_at timestamptz NULL,
  raw_payload jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enquiry_email ON "Enquiry" (email);
CREATE INDEX IF NOT EXISTS idx_enquiry_created_at ON "Enquiry" (created_at);
