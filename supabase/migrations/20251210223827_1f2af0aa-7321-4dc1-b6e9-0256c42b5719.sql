-- Add linking column to dividend_records table
ALTER TABLE dividend_records ADD COLUMN IF NOT EXISTS linked_minutes_id uuid REFERENCES minutes(id);

-- Add linking column to minutes table
ALTER TABLE minutes ADD COLUMN IF NOT EXISTS linked_dividend_id uuid REFERENCES dividend_records(id);

-- Add user preference column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS board_minutes_preference text DEFAULT 'ask';

-- Add check constraint for valid preference values
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_board_minutes_preference_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_board_minutes_preference_check 
  CHECK (board_minutes_preference IN ('dont_prompt', 'ask', 'auto_draft'));