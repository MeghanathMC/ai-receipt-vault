-- Create the receipts table for storing AI output receipts
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  output TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read receipts (for verification)
CREATE POLICY "Anyone can view receipts"
ON public.receipts
FOR SELECT
USING (true);

-- Allow anyone to insert receipts (no auth required)
CREATE POLICY "Anyone can create receipts"
ON public.receipts
FOR INSERT
WITH CHECK (true);