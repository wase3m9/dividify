-- Step 1: Extend app_role enum to include owner and support
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'support';

-- Add helpful comment
COMMENT ON TYPE app_role IS 'Application roles: owner (full access), admin (manage users), support (help users), user (standard access)';