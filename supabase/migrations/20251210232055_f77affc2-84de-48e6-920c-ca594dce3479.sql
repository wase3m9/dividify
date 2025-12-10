-- Drop existing foreign key constraints
ALTER TABLE minutes DROP CONSTRAINT IF EXISTS minutes_linked_dividend_id_fkey;
ALTER TABLE dividend_records DROP CONSTRAINT IF EXISTS dividend_records_linked_minutes_id_fkey;

-- Re-add with ON DELETE SET NULL to allow independent deletion
ALTER TABLE minutes
ADD CONSTRAINT minutes_linked_dividend_id_fkey
FOREIGN KEY (linked_dividend_id) REFERENCES dividend_records(id) ON DELETE SET NULL;

ALTER TABLE dividend_records
ADD CONSTRAINT dividend_records_linked_minutes_id_fkey
FOREIGN KEY (linked_minutes_id) REFERENCES minutes(id) ON DELETE SET NULL;