-- Enable RLS on shared_bills table
ALTER TABLE public.shared_bills ENABLE ROW LEVEL SECURITY;

-- Create policies for shared_bills table

-- Allow anyone to read a specific bill by ID
CREATE POLICY "Allow public read access by ID" ON public.shared_bills
    FOR SELECT
    USING (true);

-- Allow anyone to create a new bill
CREATE POLICY "Allow public insert" ON public.shared_bills
    FOR INSERT
    WITH CHECK (true);

-- Allow updates for any bill
CREATE POLICY "Allow updates for any bill" ON public.shared_bills
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow deletion only if the bill has expired
CREATE POLICY "Allow deletion of expired bills" ON public.shared_bills
    FOR DELETE
    USING (expires_at <= NOW());

