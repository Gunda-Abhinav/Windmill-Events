-- Migration: Add payment tracking to event_registrations
-- This adds payment status tracking and PayPal integration fields

-- Add payment tracking columns
ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_id text,
ADD COLUMN IF NOT EXISTS paypal_order_id text,
ADD COLUMN IF NOT EXISTS payment_date timestamptz,
ADD COLUMN IF NOT EXISTS payment_details jsonb,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS idx_event_registrations_payment_status ON event_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_paypal_order_id ON event_registrations(paypal_order_id);

-- Add comments for documentation
COMMENT ON COLUMN event_registrations.payment_status IS 'Payment status: pending, processing, completed, failed, refunded, cancelled';
COMMENT ON COLUMN event_registrations.payment_method IS 'Payment method used: paypal, stripe, etc.';
COMMENT ON COLUMN event_registrations.payment_id IS 'Payment transaction ID from payment provider';
COMMENT ON COLUMN event_registrations.paypal_order_id IS 'PayPal order ID for tracking';
COMMENT ON COLUMN event_registrations.payment_date IS 'Timestamp when payment was completed';
COMMENT ON COLUMN event_registrations.payment_details IS 'Full payment response from provider for debugging';

/*
Payment Status Flow:
- pending: Registration created, awaiting payment
- processing: Payment initiated, waiting for confirmation
- completed: Payment successful, registration confirmed
- failed: Payment failed or declined
- refunded: Payment was refunded
- cancelled: Registration cancelled before payment
*/

