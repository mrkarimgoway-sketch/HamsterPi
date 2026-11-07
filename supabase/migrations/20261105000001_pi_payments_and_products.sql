-- ==============================================================================
-- HamsterPi Official Pi Payments & Products Schema Extension
-- Migration: 20261105000001_pi_payments_and_products.sql
-- ==============================================================================

-- 1. PRODUCTS CATALOG TABLE (Priced in official Pi)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(48) PRIMARY KEY,
    name VARCHAR(96) NOT NULL,
    name_ar VARCHAR(96) NOT NULL,
    description TEXT NOT NULL,
    description_ar TEXT NOT NULL,
    price_pi NUMERIC(10, 4) NOT NULL CHECK (price_pi > 0),
    icon VARCHAR(32) DEFAULT 'Sparkles',
    badge VARCHAR(32),
    reward_type VARCHAR(32) NOT NULL CHECK (reward_type IN ('points_bundle', 'multiplier_boost', 'skin_unlock', 'seeds_bundle')),
    reward_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENHANCE PAYMENT RECORDS WITH EXTRA SECURITY & AUDIT FIELDS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_records' AND column_name = 'product_id') THEN
        ALTER TABLE public.payment_records ADD COLUMN product_id VARCHAR(48) REFERENCES public.products(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_records' AND column_name = 'pi_user_uid') THEN
        ALTER TABLE public.payment_records ADD COLUMN pi_user_uid VARCHAR(128);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_records' AND column_name = 'developer_approved') THEN
        ALTER TABLE public.payment_records ADD COLUMN developer_approved BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_records' AND column_name = 'developer_completed') THEN
        ALTER TABLE public.payment_records ADD COLUMN developer_completed BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_records' AND column_name = 'transaction_verified') THEN
        ALTER TABLE public.payment_records ADD COLUMN transaction_verified BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_records' AND column_name = 'error_message') THEN
        ALTER TABLE public.payment_records ADD COLUMN error_message TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_payment_records_status ON public.payment_records(status);
CREATE INDEX IF NOT EXISTS idx_payment_records_user ON public.payment_records(pi_user_uid);

-- 3. PLAYER PURCHASES (Verified granted items)
CREATE TABLE IF NOT EXISTS public.player_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id VARCHAR(48) NOT NULL REFERENCES public.products(id),
    payment_id VARCHAR(128) NOT NULL,
    price_pi NUMERIC(10, 4) NOT NULL,
    reward_granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchases_player ON public.player_purchases(player_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment ON public.player_purchases(payment_id);

-- 4. PAYMENT EVENT LOGS (Immutable audit trail for all payment callbacks)
CREATE TABLE IF NOT EXISTS public.payment_event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id VARCHAR(128) NOT NULL,
    event_type VARCHAR(48) NOT NULL,
    source VARCHAR(24) DEFAULT 'SERVER' CHECK (source IN ('CLIENT', 'SERVER', 'PI_API', 'RECOVERY')),
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_event_logs_payment ON public.payment_event_logs(payment_id);

-- 5. APP-TO-USER PAYOUT ARCHITECTURE PREPARATION (NON-ACTIVE)
-- Note: Payouts are disabled by policy. This schema strictly outlines
-- future official server-to-user disbursements if ever sanctioned by Pi Network.
CREATE TABLE IF NOT EXISTS public.app_to_user_payout_prep (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_uid VARCHAR(128) NOT NULL,
    amount NUMERIC(12, 4) NOT NULL,
    memo TEXT,
    status VARCHAR(32) DEFAULT 'ARCHITECTURAL_PREP_LOCKED' CHECK (status IN ('ARCHITECTURAL_PREP_LOCKED', 'REVOKED')),
    notes TEXT DEFAULT 'Preparation only. Gameplay points are not cryptocurrency and cannot be cashed out.',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_to_user_payout_prep ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

CREATE POLICY "Players can view own purchases" ON public.player_purchases FOR SELECT USING (
    player_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Players can view own payment records" ON public.payment_records FOR SELECT USING (
    player_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);

-- 7. SEED DATA FOR OFFICIAL PI PRODUCTS CATALOG
INSERT INTO public.products (id, name, name_ar, description, description_ar, price_pi, icon, badge, reward_type, reward_payload) VALUES
(
    'pi_pack_starter',
    'Pioneer Starter Cache',
    'حزمة الرائد المبتدئ',
    'Boost your empire with 50,000 Hamster Points and 10 Golden Seeds.',
    'عزز إمبراطوريتك بـ 50,000 نقطة هامستر و 10 بذور ذهبية.',
    0.5000,
    'Sparkles',
    'Popular',
    'points_bundle',
    '{"points": 50000, "seeds": 10}'::jsonb
),
(
    'pi_pack_booster',
    'Hyper Turbo 3X Booster',
    'مضاعف التوربو الفائق 3X',
    'Triple your tap power and passive point yield for 24 hours + 150,000 bonus points.',
    'مضاعفة قوة النقر والأرباح التلقائية 3 أضعاف لمدة 24 ساعة + 150,000 نقطة إضافية.',
    1.0000,
    'Zap',
    'Best Value',
    'multiplier_boost',
    '{"multiplier": 3.0, "duration_hours": 24, "points": 150000}'::jsonb
),
(
    'pi_pack_king_skin',
    'Royal Sovereign Outfit',
    'زي الملك المتوج الفاخر',
    'Unlock the Pi Sovereign King skin immediately with a permanent +15% yield and 500,000 points.',
    'افتح مظهر ملك باي المتوج فوراً مع +15% إنتاج دائم و 500,000 نقطة.',
    2.5000,
    'Crown',
    'Cosmetic + Boost',
    'skin_unlock',
    '{"skin": "king", "points": 500000, "passive_bonus": 0.15}'::jsonb
),
(
    'pi_pack_cyber_skin',
    'Cyberpunk Nexus Armor',
    'درع سايبربانك المستقبلي',
    'Unlock the Cyberpunk Visor & Skin with +25 tap power and 750,000 bonus points.',
    'افتح نظارة ومظهر سايبربانك مع +25 قوة نقر إضافية و 750,000 نقطة.',
    3.0000,
    'Eye',
    'Exclusive',
    'skin_unlock',
    '{"skin": "cyber", "points": 750000, "tap_bonus": 25}'::jsonb
),
(
    'pi_pack_whale',
    'Galactic Pioneer Vault',
    'خزينة الرواد المجرية',
    'Massive treasury of 2,500,000 Hamster Points and 100 Golden Seeds for true tycoon masters.',
    'خزينة عملاقة تحتوي على 2,500,000 نقطة هامستر و 100 بذرة ذهبية لرواد القمة.',
    5.0000,
    'Coins',
    'Mega Tier',
    'points_bundle',
    '{"points": 2500000, "seeds": 100}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_ar = EXCLUDED.name_ar,
    description = EXCLUDED.description,
    description_ar = EXCLUDED.description_ar,
    price_pi = EXCLUDED.price_pi,
    icon = EXCLUDED.icon,
    badge = EXCLUDED.badge,
    reward_type = EXCLUDED.reward_type,
    reward_payload = EXCLUDED.reward_payload;
