-- Fix the existing user's profile to have correct user_type
UPDATE profiles 
SET user_type = 'accountant' 
WHERE id = 'ac4d19ab-bc31-47d5-913c-2a70d17664a4';