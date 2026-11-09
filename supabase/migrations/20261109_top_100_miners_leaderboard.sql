-- ============================================================================
-- HAMSTERPI: REAL TOP 100 MINING RATE LEADERBOARD (PRODUCTION VIEW & RPC)
-- Strict Production Mode: ZERO mock or fake data.
-- Only genuine Pioneers who register and play appear on this leaderboard.
-- ============================================================================

-- 1. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_player_stats_passive_rate_desc
ON public.player_stats (passive_rate_per_hour DESC, player_id);

CREATE INDEX IF NOT EXISTS idx_player_stats_level
ON public.player_stats (level DESC);

-- 2. REAL TOP 100 MINERS VIEW
-- Dynamically ranks genuine Pioneers strictly by their real mining rate
CREATE OR REPLACE VIEW public.top_100_miners AS
SELECT 
    ROW_NUMBER() OVER (
        ORDER BY s.passive_rate_per_hour DESC, b.points DESC, p.created_at ASC
    ) AS rank,
    p.id AS player_id,
    p.pi_uid,
    p.pi_username,
    COALESCE(p.display_name, p.pi_username) AS display_name,
    COALESCE(p.current_skin, 'default') AS current_skin,
    COALESCE(s.level, 1) AS level,
    COALESCE(s.level_title, 'Bronze Forager') AS level_title,
    COALESCE(s.passive_rate_per_hour, 0) AS passive_rate_per_hour,
    COALESCE(s.passive_rate_per_sec, 0) AS passive_rate_per_sec,
    COALESCE(b.points, 0) AS points,
    COALESCE(b.golden_seeds, 0) AS golden_seeds,
    p.last_active_at
FROM public.profiles p
INNER JOIN public.player_stats s ON s.player_id = p.id
INNER JOIN public.player_balances b ON b.player_id = p.id
ORDER BY s.passive_rate_per_hour DESC, b.points DESC
LIMIT 100;

-- 3. SECURE RPC FUNCTION FOR CLIENT ACCESS
CREATE OR REPLACE FUNCTION public.get_top_100_miners()
RETURNS TABLE (
    rank BIGINT,
    player_id UUID,
    pi_username TEXT,
    display_name TEXT,
    current_skin TEXT,
    level INTEGER,
    level_title TEXT,
    passive_rate_per_hour NUMERIC,
    passive_rate_per_sec NUMERIC,
    points BIGINT,
    golden_seeds INTEGER
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT 
        rank,
        player_id,
        pi_username,
        display_name,
        current_skin,
        level,
        level_title,
        passive_rate_per_hour,
        passive_rate_per_sec,
        points,
        golden_seeds
    FROM public.top_100_miners;
$$;

-- 4. GRANT PERMISSIONS TO PUBLIC AND AUTH ROLES
GRANT SELECT ON public.top_100_miners TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_top_100_miners() TO anon, authenticated, service_role;

-- 5. ENSURE RLS POLICIES ALLOW PUBLIC READING OF LEADERBOARD TABLES
DROP POLICY IF EXISTS "Public player stats viewable" ON public.player_stats;
CREATE POLICY "Public player stats viewable"
    ON public.player_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
CREATE POLICY "Public profiles viewable"
    ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public player balances viewable" ON public.player_balances;
CREATE POLICY "Public player balances viewable"
    ON public.player_balances FOR SELECT USING (true);
