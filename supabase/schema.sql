-- ============================================================================
-- HAMSTERPI SUPABASE CONSOLIDATED PRODUCTION SCHEMA
-- Complete database schema for HamsterPi Web3 Gaming Ecosystem on Pi Network
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. CORE PLAYER TABLES
-- ============================================================================

-- PROFILES (Verified Pi Network Pioneers)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pi_uid TEXT UNIQUE NOT NULL,
    pi_username TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    current_skin TEXT DEFAULT 'default',
    role TEXT DEFAULT 'pioneer' CHECK (role IN ('pioneer', 'moderator', 'admin')),
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- PLAYER BALANCES (Tokens, Points, and Seeds)
CREATE TABLE IF NOT EXISTS public.player_balances (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    points BIGINT DEFAULT 1000 NOT NULL CHECK (points >= 0),
    lifetime_points_earned BIGINT DEFAULT 1000 NOT NULL,
    golden_seeds INTEGER DEFAULT 0 NOT NULL CHECK (golden_seeds >= 0),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- PLAYER STATS & PROGRESSION
CREATE TABLE IF NOT EXISTS public.player_stats (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1 NOT NULL CHECK (level >= 1),
    level_title TEXT DEFAULT 'Bronze Forager',
    total_taps BIGINT DEFAULT 0 NOT NULL,
    tap_power INTEGER DEFAULT 1 NOT NULL,
    passive_rate_per_sec NUMERIC DEFAULT 0 NOT NULL,
    passive_rate_per_hour NUMERIC DEFAULT 0 NOT NULL,
    critical_chance NUMERIC DEFAULT 0.05 NOT NULL,
    critical_multiplier NUMERIC DEFAULT 2.0 NOT NULL,
    login_streak INTEGER DEFAULT 1 NOT NULL,
    last_login_date DATE DEFAULT CURRENT_DATE,
    minigames_played INTEGER DEFAULT 0 NOT NULL,
    highest_minigame_score INTEGER DEFAULT 0 NOT NULL,
    referral_count INTEGER DEFAULT 0 NOT NULL,
    active_booster_multiplier NUMERIC DEFAULT 1.0 NOT NULL,
    active_booster_expires_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- PLAYER ENERGY
CREATE TABLE IF NOT EXISTS public.player_energy (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_energy INTEGER DEFAULT 1000 NOT NULL CHECK (current_energy >= 0),
    max_energy INTEGER DEFAULT 1000 NOT NULL,
    regen_rate_per_sec INTEGER DEFAULT 3 NOT NULL,
    last_energy_updated_at TIMESTAMPTZ DEFAULT now()
);

-- PLAYER UPGRADES (80 Promotions - Max Level 30)
CREATE TABLE IF NOT EXISTS public.player_upgrades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    upgrade_id TEXT NOT NULL,
    current_level INTEGER DEFAULT 0 NOT NULL CHECK (current_level >= 0 AND current_level <= 30),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_player_upgrade UNIQUE (player_id, upgrade_id)
);

-- ============================================================================
-- 3. PI NETWORK OFFICIAL PAYMENTS & AUDIT LEDGER
-- ============================================================================

-- PAYMENT RECORDS (Complete official Pi payment state machine)
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    pi_payment_id TEXT UNIQUE NOT NULL,
    pi_user_uid TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    memo TEXT,
    product_id TEXT,
    status TEXT NOT NULL,
    developer_approved BOOLEAN DEFAULT FALSE NOT NULL,
    developer_completed BOOLEAN DEFAULT FALSE NOT NULL,
    transaction_verified BOOLEAN DEFAULT FALSE NOT NULL,
    server_txid TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- PAYMENT EVENT LOGS (Immutable event history)
CREATE TABLE IF NOT EXISTS public.payment_event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PLAYER PURCHASES (Granted shop items & multiplier packages)
CREATE TABLE IF NOT EXISTS public.player_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    payment_id TEXT UNIQUE NOT NULL,
    price_pi NUMERIC NOT NULL,
    reward_granted BOOLEAN DEFAULT FALSE NOT NULL,
    granted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 4. GAME SESSIONS & AUDIT LOGS
-- ============================================================================

-- GAME TRANSACTIONS (Auditable point movements & history)
CREATE TABLE IF NOT EXISTS public.game_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    idempotency_key TEXT UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TAP SESSIONS (Server sync batches)
CREATE TABLE IF NOT EXISTS public.tap_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tap_count INTEGER NOT NULL CHECK (tap_count > 0),
    duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
    points_awarded BIGINT NOT NULL,
    energy_consumed INTEGER NOT NULL,
    client_timestamp TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- MINIGAME SESSIONS (Arcade score and rewards audit)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_key TEXT NOT NULL,
    raw_score INTEGER NOT NULL,
    reward_awarded BIGINT NOT NULL,
    verified BOOLEAN DEFAULT TRUE NOT NULL,
    ended_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_pi_uid ON public.profiles(pi_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_player_balances_points ON public.player_balances(points DESC);
CREATE INDEX IF NOT EXISTS idx_payment_records_pi_payment_id ON public.payment_records(pi_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_pi_user_uid ON public.payment_records(pi_user_uid);
CREATE INDEX IF NOT EXISTS idx_payment_event_logs_payment_id ON public.payment_event_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_game_transactions_player_created ON public.game_transactions(player_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_player_upgrades_player_id ON public.player_upgrades(player_id);

-- ============================================================================
-- 6. AUTOMATED PROVISIONING TRIGGER FOR NEW PIONEERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_player()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Initialize Player Balance
    INSERT INTO public.player_balances (player_id, points, lifetime_points_earned, golden_seeds)
    VALUES (NEW.id, 1000, 1000, 0)
    ON CONFLICT (player_id) DO NOTHING;

    -- 2. Initialize Player Stats
    INSERT INTO public.player_stats (player_id, level, level_title, total_taps, tap_power, passive_rate_per_sec, passive_rate_per_hour)
    VALUES (NEW.id, 1, 'Bronze Forager', 0, 1, 0, 0)
    ON CONFLICT (player_id) DO NOTHING;

    -- 3. Initialize Player Energy
    INSERT INTO public.player_energy (player_id, current_energy, max_energy, regen_rate_per_sec)
    VALUES (NEW.id, 1000, 1000, 3)
    ON CONFLICT (player_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_pioneer_created ON public.profiles;
CREATE TRIGGER on_pioneer_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_player();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_energy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tap_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Service Role Key has unrestricted bypass
-- Anonymous & Authenticated Pioneer Policies:

-- Profiles: Public can view leaderboards / profiles; authenticated service updates
DROP POLICY IF EXISTS "Public profiles can be viewed by anyone" ON public.profiles;
CREATE POLICY "Public profiles can be viewed by anyone"
    ON public.profiles FOR SELECT USING (true);

-- Balances: Public can view top scores for global leaderboards
DROP POLICY IF EXISTS "Public balances can be viewed for leaderboards" ON public.player_balances;
CREATE POLICY "Public balances can be viewed for leaderboards"
    ON public.player_balances FOR SELECT USING (true);

-- Stats: Public can view for leaderboards
DROP POLICY IF EXISTS "Public player stats viewable" ON public.player_stats;
CREATE POLICY "Public player stats viewable"
    ON public.player_stats FOR SELECT USING (true);

-- Energy: Read allowed
DROP POLICY IF EXISTS "Player energy viewable" ON public.player_energy;
CREATE POLICY "Player energy viewable"
    ON public.player_energy FOR SELECT USING (true);

-- Upgrades: Read allowed
DROP POLICY IF EXISTS "Player upgrades viewable" ON public.player_upgrades;
CREATE POLICY "Player upgrades viewable"
    ON public.player_upgrades FOR SELECT USING (true);

-- Game Transactions: Insertable and viewable
DROP POLICY IF EXISTS "Game transactions viewable" ON public.game_transactions;
CREATE POLICY "Game transactions viewable"
    ON public.game_transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Game transactions insertable" ON public.game_transactions;
CREATE POLICY "Game transactions insertable"
    ON public.game_transactions FOR INSERT WITH CHECK (true);

-- Tap Sessions: Insertable
DROP POLICY IF EXISTS "Tap sessions insertable" ON public.tap_sessions;
CREATE POLICY "Tap sessions insertable"
    ON public.tap_sessions FOR INSERT WITH CHECK (true);

-- Game Sessions: Insertable
DROP POLICY IF EXISTS "Game sessions insertable" ON public.game_sessions;
CREATE POLICY "Game sessions insertable"
    ON public.game_sessions FOR INSERT WITH CHECK (true);

-- Payment Records: Read only
DROP POLICY IF EXISTS "Payment records readable" ON public.payment_records;
CREATE POLICY "Payment records readable"
    ON public.payment_records FOR SELECT USING (true);

-- Player Purchases: Read only
DROP POLICY IF EXISTS "Player purchases readable" ON public.player_purchases;
CREATE POLICY "Player purchases readable"
    ON public.player_purchases FOR SELECT USING (true);
