-- 1. Get the User ID
-- Go to Authentication > Users in Supabase Dashboard and copy the User UID of the account you want to make admin.

-- 2. Run this SQL in the SQL Editor
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Verify
-- SELECT * FROM public.user_roles WHERE user_id = 'YOUR_USER_ID_HERE';
