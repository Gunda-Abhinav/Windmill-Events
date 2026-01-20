-- Add email_error column to Enquiry for storing last email error message
ALTER TABLE "Enquiry"
  ADD COLUMN IF NOT EXISTS email_error text;
