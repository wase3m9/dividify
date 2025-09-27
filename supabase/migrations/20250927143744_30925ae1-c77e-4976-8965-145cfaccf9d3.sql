-- Add admin roles for both users
INSERT INTO public.user_roles (user_id, role, created_by) VALUES 
('ac4d19ab-bc31-47d5-913c-2a70d17664a4', 'admin', 'ac4d19ab-bc31-47d5-913c-2a70d17664a4'),
('6112ea61-4a46-47a8-9397-1a075cc648a5', 'admin', '6112ea61-4a46-47a8-9397-1a075cc648a5')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update wazamusa@hotmail.com user type from accountant to individual
UPDATE public.profiles 
SET user_type = 'individual', updated_at = now()
WHERE id = '6112ea61-4a46-47a8-9397-1a075cc648a5';