-- Supabase Migration: Create cron_logs table
-- Run this in Supabase SQL Editor

-- Create cron_logs table
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  task_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  message TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_cron_logs_task_name ON public.cron_logs(task_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_logged_at ON public.cron_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_cron_logs_status ON public.cron_logs(status);

-- Add comment to table
COMMENT ON TABLE public.cron_logs IS 'Stores cronjob execution logs for monitoring and debugging';

-- Enable Row Level Security (RLS)
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin role to read and insert
CREATE POLICY "Allow service role to manage cron_logs"
  ON public.cron_logs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Optional: Policy untuk anonymous to read logs
CREATE POLICY "Allow anon to read cron_logs"
  ON public.cron_logs
  FOR SELECT
  USING (true);
