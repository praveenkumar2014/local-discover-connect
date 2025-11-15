-- Create payment_orders table for Cashfree integration
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  cashfree_order_id TEXT,
  payment_session_id TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own orders"
  ON public.payment_orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.payment_orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert orders"
  ON public.payment_orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update orders"
  ON public.payment_orders
  FOR UPDATE
  USING (true);

-- Create index for faster lookups
CREATE INDEX idx_payment_orders_user_id ON public.payment_orders(user_id);
CREATE INDEX idx_payment_orders_status ON public.payment_orders(status);
CREATE INDEX idx_payment_orders_order_id ON public.payment_orders(order_id);