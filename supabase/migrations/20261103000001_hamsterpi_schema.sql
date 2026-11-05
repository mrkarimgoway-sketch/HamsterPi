-- ==============================================================================
-- HamsterPi Database Schema Migration
-- Production-ready PostgreSQL schema with Supabase Auth, RLS, and Stored Procedures
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES (Pioneers & Hamster Masters)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pi_uid VARCHAR(128) UNIQUE, -- Official Pi Network Platform UID
    pi_username VARCHAR(64) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'pioneer' CHECK (role IN ('pioneer', 'moderator', 'admin', 'superadmin')),
    display_name VARCHAR(64),
    avatar_url TEXT DEFAULT '/src/assets/images/hamster_mascot_default_1793717666154.jpg',
    current_skin VARCHAR(32) DEFAULT 'default',
    country_code VARCHAR(8) DEFAULT 'GLOBAL',
    language VARCHAR(8) DEFAULT 'en',
    is_banned BOOLEAN DEFAULT FALSE,
    is_flagged_cheat BOOLEAN DEFAULT FALSE,
    referred_by VARCHAR(64), -- referral code of inviter
    referral_code VARCHAR(32) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy username and referral lookup
CREATE INDEX IF NOT EXISTS idx_profiles_pi_uid ON public.profiles(pi_uid);
CREATE INDEX IF NOT EXISTS idx_profiles_ref_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(pi_username);

-- 3. PLAYER BALANCES (Internal Game Points - Auditable)
CREATE TABLE IF NOT EXISTS public.player_balances (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    points NUMERIC(24, 2) DEFAULT 1000.00 NOT NULL CHECK (points >= 0),
    lifetime_points_earned NUMERIC(24, 2) DEFAULT 1000.00 NOT NULL,
    total_spent NUMERIC(24, 2) DEFAULT 0.00 NOT NULL,
    golden_seeds INTEGER DEFAULT 5 NOT NULL CHECK (golden_seeds >= 0), -- premium in-game boost currency
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PLAYER STATS (Game progression state)
CREATE TABLE IF NOT EXISTS public.player_stats (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1 NOT NULL,
    level_title VARCHAR(64) DEFAULT 'Bronze Hamster' NOT NULL,
    total_taps BIGINT DEFAULT 0 NOT NULL,
    tap_power NUMERIC(10, 2) DEFAULT 1.00 NOT NULL,
    passive_rate_per_sec NUMERIC(12, 4) DEFAULT 0.0000 NOT NULL,
    passive_rate_per_hour NUMERIC(14, 2) DEFAULT 0.00 NOT NULL,
    critical_chance NUMERIC(4, 3) DEFAULT 0.05 NOT NULL, -- 5% base crit
    critical_multiplier NUMERIC(4, 2) DEFAULT 2.00 NOT NULL,
    last_passive_claimed_at TIMESTAMPTZ DEFAULT NOW(),
    login_streak INTEGER DEFAULT 1 NOT NULL,
    last_login_date DATE DEFAULT CURRENT_DATE,
    highest_minigame_score INTEGER DEFAULT 0,
    minigames_played INTEGER DEFAULT 0,
    referral_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENERGY STATE (Server-authoritative energy regeneration)
CREATE TABLE IF NOT EXISTS public.energy_state (
    player_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_energy INTEGER DEFAULT 1000 NOT NULL,
    max_energy INTEGER DEFAULT 1000 NOT NULL,
    regen_rate_per_sec NUMERIC(6, 2) DEFAULT 2.00 NOT NULL,
    last_energy_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GAME TRANSACTIONS (Auditable balance ledger)
CREATE TABLE IF NOT EXISTS public.game_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(24, 2) NOT NULL, -- positive for credits, negative for debits
    balance_after NUMERIC(24, 2) NOT NULL,
    category VARCHAR(32) NOT NULL CHECK (category IN (
        'tap_batch', 'upgrade_purchase', 'passive_income',
        'daily_reward', 'mission_reward', 'minigame_reward',
        'referral_bonus', 'admin_adjustment', 'skin_purchase'
    )),
    description TEXT,
    idempotency_key VARCHAR(128) UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tx_player_created ON public.game_transactions(player_id, created_at DESC);

-- 7. TAP SESSIONS (Anti-cheat verified batches)
CREATE TABLE IF NOT EXISTS public.tap_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tap_count INTEGER NOT NULL CHECK (tap_count > 0),
    duration_ms INTEGER NOT NULL CHECK (duration_ms > 0),
    points_awarded NUMERIC(16, 2) NOT NULL,
    energy_consumed INTEGER NOT NULL,
    client_timestamp TIMESTAMPTZ NOT NULL,
    server_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HAMSTER UPGRADES CATALOG
CREATE TABLE IF NOT EXISTS public.hamster_upgrades (
    id VARCHAR(48) PRIMARY KEY,
    category VARCHAR(24) NOT NULL CHECK (category IN ('hamster', 'business', 'special')),
    name VARCHAR(64) NOT NULL,
    name_ar VARCHAR(64) NOT NULL,
    description TEXT,
    description_ar TEXT,
    icon VARCHAR(32) NOT NULL,
    base_cost NUMERIC(18, 2) NOT NULL,
    cost_multiplier NUMERIC(4, 2) DEFAULT 1.15 NOT NULL,
    base_benefit NUMERIC(12, 4) NOT NULL, -- e.g. points/sec or tap_power
    benefit_type VARCHAR(24) NOT NULL CHECK (benefit_type IN ('tap_power', 'passive_per_sec', 'max_energy', 'regen_rate', 'crit_chance')),
    min_player_level INTEGER DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. PLAYER UPGRADES (Owned upgrades per player)
CREATE TABLE IF NOT EXISTS public.player_upgrades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    upgrade_id VARCHAR(48) NOT NULL REFERENCES public.hamster_upgrades(id) ON DELETE CASCADE,
    current_level INTEGER DEFAULT 1 NOT NULL,
    total_spent NUMERIC(24, 2) DEFAULT 0.00 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_player_upgrade UNIQUE (player_id, upgrade_id)
);

-- 10. MISSIONS CATALOG
CREATE TABLE IF NOT EXISTS public.missions (
    id VARCHAR(48) PRIMARY KEY,
    frequency VARCHAR(16) DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'achievement')),
    title VARCHAR(96) NOT NULL,
    title_ar VARCHAR(96) NOT NULL,
    description TEXT,
    description_ar TEXT,
    target_action VARCHAR(32) NOT NULL,
    target_count INTEGER NOT NULL,
    reward_points NUMERIC(18, 2) NOT NULL,
    reward_seeds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 11. PLAYER MISSIONS PROGRESS
CREATE TABLE IF NOT EXISTS public.player_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id VARCHAR(48) NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    is_claimed BOOLEAN DEFAULT FALSE,
    period_start DATE DEFAULT CURRENT_DATE,
    completed_at TIMESTAMPTZ,
    claimed_at TIMESTAMPTZ,
    CONSTRAINT uq_player_mission_period UNIQUE (player_id, mission_id, period_start)
);

-- 12. MINI GAMES SESSIONS & SCORES
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_key VARCHAR(32) NOT NULL CHECK (game_key IN ('rush', 'memory', 'puzzle', 'jump', 'quiz')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    raw_score INTEGER DEFAULT 0,
    reward_awarded NUMERIC(18, 2) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    checksum VARCHAR(128)
);

-- 13. REFERRALS & BONUSES
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invitee_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bonus_points_awarded NUMERIC(18, 2) DEFAULT 5000.00 NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_inviter ON public.referrals(inviter_id);

-- 14. PI PAYMENT RECORDS (Official Pi Network Platform Payments)
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pi_payment_id VARCHAR(128) UNIQUE NOT NULL,
    amount NUMERIC(12, 4) NOT NULL, -- Pi amount
    memo TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(24) DEFAULT 'INITIALIZED' CHECK (status IN (
        'INITIALIZED', 'READY_FOR_APPROVAL', 'APPROVED',
        'COMPLETED', 'CANCELLED', 'FAILED'
    )),
    server_txid VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUDIT LOGS & FRAUD PREVENTIONS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(32),
    entity_id VARCHAR(64),
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tap_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hamster_upgrades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Catalog tables are world-readable
CREATE POLICY "Public read hamster_upgrades" ON public.hamster_upgrades FOR SELECT USING (true);
CREATE POLICY "Public read missions" ON public.missions FOR SELECT USING (true);

-- Profiles: Public can read leaderboard data (username, avatar, level), users can update their own
CREATE POLICY "Profiles readable by anyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Player Balances & Stats: Player can read their own
CREATE POLICY "Read own balance" ON public.player_balances FOR SELECT USING (
    player_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Read own stats" ON public.player_stats FOR SELECT USING (
    player_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Leaderboard read stats" ON public.player_stats FOR SELECT USING (true);

-- 17. SEED DATA FOR UPGRADES
INSERT INTO public.hamster_upgrades (id, category, name, name_ar, description, description_ar, icon, base_cost, cost_multiplier, base_benefit, benefit_type, min_player_level) VALUES
('tap_paws_1', 'hamster', 'Velvet Gloves', 'قفازات مخملية', '+1 Tap Power per click', '+1 قوة النقر في كل ضغطة', 'Sparkles', 50.00, 1.15, 1.0000, 'tap_power', 1),
('energy_seeds_1', 'hamster', 'Golden Seeds Diet', 'حمية البذور الذهبية', '+250 Max Energy capacity', '+250 سعة طاقة إضافية', 'BatteryCharging', 150.00, 1.18, 250.0000, 'max_energy', 1),
('caffeine_nut', 'hamster', 'Caffeine Sunflower', 'عباد شمس كافيين', '+1.5 Energy Regen / sec', '+1.5 تجديد طاقة في الثانية', 'Zap', 300.00, 1.22, 1.5000, 'regen_rate', 2),
('lucky_clover', 'hamster', 'Four-Leaf Clover', 'نبتة الحظ', '+3% Critical Tap Chance', '+3% فرصة ضربة حاسمة', 'Award', 750.00, 1.25, 0.0300, 'crit_chance', 3),

('pi_node_workshop', 'business', 'Pi Node Workshop', 'ورشة عقدة باي', 'Generates 5 Points/sec passively', 'تولد 5 نقاط/ثانية تلقائياً', 'Cpu', 200.00, 1.16, 5.0000, 'passive_per_sec', 1),
('hamster_rig', 'business', 'Hamster Wheel Rig', 'عجلة التعدين الذكية', 'Generates 25 Points/sec passively', 'تولد 25 نقطة/ثانية تلقائياً', 'Activity', 1200.00, 1.17, 25.0000, 'passive_per_sec', 2),
('solar_seed_farm', 'business', 'Solar Seed Farm', 'مزرعة البذور الشمسية', 'Generates 120 Points/sec passively', 'تولد 120 نقطة/ثانية تلقائياً', 'Sun', 5500.00, 1.18, 120.0000, 'passive_per_sec', 4),
('pi_data_center', 'business', 'Pi Cloud Data Center', 'مركز بيانات باي السحابي', 'Generates 600 Points/sec passively', 'تولد 600 نقطة/ثانية تلقائياً', 'Server', 28000.00, 1.20, 600.0000, 'passive_per_sec', 6),
('quantum_lab', 'business', 'Quantum Hamster Lab', 'مختبر الهامستر الكمي', 'Generates 3,200 Points/sec passively', 'تولد 3,200 نقطة/ثانية تلقائياً', 'Atom', 150000.00, 1.22, 3200.0000, 'passive_per_sec', 8),

('royal_crown', 'special', 'Royal Pi Crown', 'تاج باي الملكي', 'Unlocks King Hamster Skin & +15% Global Yield', 'يفتح مظهر الملك و +15% عائد إضافي', 'Crown', 50000.00, 1.50, 0.1500, 'passive_per_sec', 5),
('cyber_visor', 'special', 'Cyberpunk Visor', 'نظارة سايبربانك', 'Unlocks Cyber Hamster Skin & +20 Tap Power', 'يفتح مظهر السايبر و +20 قوة نقر', 'Eye', 80000.00, 1.50, 20.0000, 'tap_power', 7)
ON CONFLICT (id) DO NOTHING;

-- 18. SEED DATA FOR DAILY MISSIONS
INSERT INTO public.missions (id, frequency, title, title_ar, description, description_ar, target_action, target_count, reward_points, reward_seeds) VALUES
('m_taps_daily', 'daily', 'Hamster Warmup', 'تسخين الهامستر', 'Tap the hamster 300 times', 'انقر على الهامستر 300 مرة', 'tap', 300, 1500.00, 1),
('m_games_daily', 'daily', 'Arcade Champion', 'بطل الألعاب', 'Play any 3 mini games today', 'العب أي 3 ألعاب مصغرة اليوم', 'play_minigame', 3, 2500.00, 2),
('m_upgrade_daily', 'daily', 'Smart Investor', 'مستثمر ذكي', 'Purchase or level up 1 upgrade', 'اشترِ أو طور ترقية واحدة', 'upgrade', 1, 2000.00, 1),
('m_rush_score', 'daily', 'Speed Demon', 'عاصفة السرعة', 'Score 300+ in Hamster Rush', 'حقق 300+ نقطة في هامستر راش', 'rush_score', 300, 3000.00, 2),
('m_weekly_referral', 'weekly', 'Community Builder', 'باني المجتمع', 'Invite 1 Pioneer friend', 'ادعُ صديقاً واحداً من الرواد', 'referral', 1, 10000.00, 5)
ON CONFLICT (id) DO NOTHING;
