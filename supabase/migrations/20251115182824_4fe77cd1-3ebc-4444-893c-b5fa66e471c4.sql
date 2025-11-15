-- Assign super admin role to pranu21m@gmail.com
DO $$
DECLARE
  super_admin_user_id uuid;
  admin_user_id uuid;
BEGIN
  -- Get user IDs from auth.users based on email
  SELECT id INTO super_admin_user_id FROM auth.users WHERE email = 'pranu21m@gmail.com';
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'mgkrishnac@gmail.com';
  
  -- Insert super admin role if user exists
  IF super_admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (super_admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  -- Insert admin role if user exists
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;

-- Create a function to auto-assign admin role on signup for specified emails
CREATE OR REPLACE FUNCTION public.assign_admin_role_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user's email matches admin emails
  IF NEW.email IN ('pranu21m@gmail.com', 'mgkrishnac@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to assign admin role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_role_on_signup();