-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid default uuid_generate_v4() primary key,
  line_user_id text unique not null,
  display_name text,
  picture_url text,
  status_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS (Row Level Security) policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Add the deletion policy for shared_bills
CREATE POLICY "Allow deletion of expired bills" ON public.shared_bills
    FOR DELETE
    USING (expires_at <= NOW());