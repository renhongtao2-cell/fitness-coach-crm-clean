-- Add email column to referral_codes for easier lookup
ALTER TABLE referral_codes ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing codes with email from profiles
UPDATE referral_codes rc SET email = p.email
FROM profiles p
WHERE rc.owner_id = p.id;

-- Make email NOT NULL for future inserts
ALTER TABLE referral_codes ALTER COLUMN email SET NOT NULL;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_referral_codes_email ON referral_codes(email);
