-- Fix security warnings: Set search_path for existing functions

-- Update handle_new_user function to set search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Update update_business_rating function to set search_path
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.businesses
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE business_id = NEW.business_id AND status = 'approved'
    )
  WHERE id = NEW.business_id;
  RETURN NEW;
END;
$$;