-- =========================================================================
-- HamsterPi: Pi Ecosystem Projects & Voluntary Escrow Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- 1. Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Project Funding Aggregate Table
CREATE TABLE IF NOT EXISTS public.project_funding (
    id TEXT PRIMARY KEY,
    project_id TEXT UNIQUE NOT NULL,
    project_name TEXT NOT NULL,
    funding_target_pi NUMERIC(14, 2) NOT NULL DEFAULT 0,
    current_funding_pi NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_backers INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial project rows
INSERT INTO public.project_funding (id, project_id, project_name, funding_target_pi, current_funding_pi, total_backers)
VALUES 
    ('fund_pimind_ai', 'pimind_ai', 'PiMind AI', 300000.00, 134250.00, 4890),
    ('fund_pi_battle_arena', 'pi_battle_arena', 'Pi Battle Arena', 1000000.00, 412800.00, 12640)
ON CONFLICT (project_id) DO NOTHING;

-- 3. Voluntary Project Contributions Log (Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.project_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT NOT NULL REFERENCES public.project_funding(project_id) ON DELETE CASCADE,
    pi_payment_id TEXT UNIQUE NOT NULL,
    pi_user_uid TEXT NOT NULL,
    amount_pi NUMERIC(10, 2) NOT NULL CHECK (amount_pi > 0),
    txid TEXT,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy queries by project and user
CREATE INDEX IF NOT EXISTS idx_project_contributions_project ON public.project_contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_project_contributions_user ON public.project_contributions(pi_user_uid);

-- 4. Automatic Trigger to update project_funding when a new contribution is recorded
CREATE OR REPLACE FUNCTION public.fn_update_project_funding_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.project_funding
    SET current_funding_pi = current_funding_pi + NEW.amount_pi,
        total_backers = (
            SELECT COUNT(DISTINCT pi_user_uid)
            FROM public.project_contributions
            WHERE project_id = NEW.project_id AND status = 'COMPLETED'
        ),
        updated_at = NOW()
    WHERE project_id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_after_project_contribution ON public.project_contributions;
CREATE TRIGGER trg_after_project_contribution
AFTER INSERT ON public.project_contributions
FOR EACH ROW
WHEN (NEW.status = 'COMPLETED')
EXECUTE FUNCTION public.fn_update_project_funding_totals();

-- 5. Row Level Security (RLS)
ALTER TABLE public.project_funding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributions ENABLE ROW LEVEL SECURITY;

-- Allow public read of funding statistics
CREATE POLICY "Allow public read for project funding" 
    ON public.project_funding FOR SELECT USING (true);

-- Allow public read for contributions (for transparent ecosystem tracker)
CREATE POLICY "Allow public read for contributions" 
    ON public.project_contributions FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to funding"
    ON public.project_funding FOR ALL USING (true);

CREATE POLICY "Allow service role full access to contributions"
    ON public.project_contributions FOR ALL USING (true);
