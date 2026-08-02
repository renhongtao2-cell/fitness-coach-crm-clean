-- Migration: 006_add_message_sender
-- Description: Add sender column to messages table to distinguish who sent the message
-- Without this, the app cannot tell whether a message was sent by coach or client

ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender TEXT DEFAULT 'coach' CHECK (sender IN ('coach', 'client'));

-- Backfill: existing messages are assumed to be from coach (the only sender before this fix)
UPDATE messages SET sender = 'coach' WHERE sender IS NULL;

-- Add index for faster sender-based queries
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);
