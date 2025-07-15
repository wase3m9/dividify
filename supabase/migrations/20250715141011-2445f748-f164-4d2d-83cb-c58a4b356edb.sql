
-- Add user_type column to profiles table to distinguish between individual users and accountants
ALTER TABLE public.profiles ADD COLUMN user_type TEXT DEFAULT 'individual' CHECK (user_type IN ('individual', 'accountant'));

-- Update existing users to have a user_type based on their subscription plan
UPDATE public.profiles 
SET user_type = 'accountant' 
WHERE subscription_plan = 'accountant';

-- Update existing users to have individual type for other plans
UPDATE public.profiles 
SET user_type = 'individual' 
WHERE subscription_plan IN ('starter', 'professional', 'enterprise', 'trial');
