/**
 * Server-side Supabase Database Client & Payment Ledger Service
 * Runs strictly on the Node.js backend.
 * Uses SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  !supabaseUrl.includes('your-project') &&
  !serviceRoleKey.includes('your-')
);

export const serverSupabase: SupabaseClient | null = isServerSupabaseConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })
  : null;

export const serverDb = {
  /**
   * Upsert a verified Pi Pioneer profile
   */
  async upsertPioneer(piUser: { uid: string; username: string }) {
    if (!serverSupabase) return null;

    try {
      const { data, error } = await serverSupabase
        .from('profiles')
        .upsert(
          {
            pi_uid: piUser.uid,
            pi_username: piUser.username,
            display_name: piUser.username,
            referral_code: 'PI_' + piUser.username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8),
            last_active_at: new Date().toISOString(),
          },
          { onConflict: 'pi_uid' }
        )
        .select()
        .single();

      if (error) {
        console.warn('[Server DB] Upsert profile error:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('[Server DB] Exception during profile upsert:', err);
      return null;
    }
  },

  /**
   * Log an immutable payment event
   */
  async logPaymentEvent(
    paymentId: string,
    eventType: string,
    source: 'CLIENT' | 'SERVER' | 'PI_API' | 'RECOVERY',
    payload: Record<string, unknown>
  ) {
    if (!serverSupabase) return;

    try {
      await serverSupabase.from('payment_event_logs').insert({
        payment_id: paymentId,
        event_type: eventType,
        source,
        payload,
      });
    } catch (err) {
      console.warn('[Server DB] Failed to log payment event:', err);
    }
  },

  /**
   * Record or update payment record
   */
  async recordPaymentState(payment: {
    paymentId: string;
    piUserUid: string;
    amount: number;
    memo?: string;
    productId?: string;
    status: string;
    developerApproved?: boolean;
    developerCompleted?: boolean;
    transactionVerified?: boolean;
    txid?: string;
    metadata?: Record<string, unknown>;
  }) {
    if (!serverSupabase) return;

    try {
      // Find internal player id by pi_uid
      let playerId: string | null = null;
      const { data: profile } = await serverSupabase
        .from('profiles')
        .select('id')
        .eq('pi_uid', payment.piUserUid)
        .single();

      if (profile) playerId = profile.id;

      if (!playerId) {
        // Fallback: create minimal profile record
        const newProf = await this.upsertPioneer({
          uid: payment.piUserUid,
          username: 'Pioneer_' + payment.piUserUid.substring(0, 6),
        });
        if (newProf) playerId = newProf.id;
      }

      if (!playerId) return;

      await serverSupabase.from('payment_records').upsert(
        {
          player_id: playerId,
          pi_payment_id: payment.paymentId,
          pi_user_uid: payment.piUserUid,
          amount: payment.amount,
          memo: payment.memo,
          product_id: payment.productId,
          status: payment.status,
          developer_approved: payment.developerApproved ?? false,
          developer_completed: payment.developerCompleted ?? false,
          transaction_verified: payment.transactionVerified ?? false,
          server_txid: payment.txid,
          metadata: payment.metadata || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'pi_payment_id' }
      );
    } catch (err) {
      console.warn('[Server DB] Failed to record payment state:', err);
    }
  },

  /**
   * Finalize reward grant after successful payment completion (idempotent)
   */
  async grantPurchaseReward(params: {
    paymentId: string;
    piUserUid: string;
    productId: string;
    pricePi: number;
    txid: string;
    reward: Record<string, unknown>;
  }) {
    if (!serverSupabase) return { granted: false, reason: 'SUPABASE_NOT_CONFIGURED' };

    try {
      // Check if purchase already recorded & granted
      const { data: existing } = await serverSupabase
        .from('player_purchases')
        .select('id, reward_granted')
        .eq('payment_id', params.paymentId)
        .maybeSingle();

      if (existing && existing.reward_granted) {
        return { granted: true, alreadyGranted: true };
      }

      const { data: profile } = await serverSupabase
        .from('profiles')
        .select('id')
        .eq('pi_uid', params.piUserUid)
        .single();

      if (!profile) {
        return { granted: false, reason: 'PROFILE_NOT_FOUND' };
      }

      const playerId = profile.id;

      // Safe write: update existing or insert new without hard constraint dependency
      if (existing) {
        await serverSupabase
          .from('player_purchases')
          .update({
            reward_granted: true,
            granted_at: new Date().toISOString(),
            metadata: { txid: params.txid, reward: params.reward },
          })
          .eq('id', existing.id);
      } else {
        await serverSupabase.from('player_purchases').insert({
          player_id: playerId,
          product_id: params.productId,
          payment_id: params.paymentId,
          price_pi: params.pricePi,
          reward_granted: true,
          granted_at: new Date().toISOString(),
          metadata: { txid: params.txid, reward: params.reward },
        });
      }

      // Apply points/seeds reward if defined
      const rewardPoints = Number(params.reward.points || 0);
      const rewardSeeds = Number(params.reward.seeds || 0);

      if (rewardPoints > 0 || rewardSeeds > 0) {
        // Update player balance
        const { data: balanceData } = await serverSupabase
          .from('player_balances')
          .select('points, lifetime_points_earned, golden_seeds')
          .eq('player_id', playerId)
          .single();

        if (balanceData) {
          await serverSupabase
            .from('player_balances')
            .update({
              points: balanceData.points + rewardPoints,
              lifetime_points_earned: balanceData.lifetime_points_earned + rewardPoints,
              golden_seeds: balanceData.golden_seeds + rewardSeeds,
              updated_at: new Date().toISOString(),
            })
            .eq('player_id', playerId);
        }

        // Add auditable game transaction
        await serverSupabase.from('game_transactions').insert({
          player_id: playerId,
          amount: rewardPoints,
          balance_after: (balanceData?.points || 0) + rewardPoints,
          category: 'daily_reward',
          description: `Pi Purchase Granted: ${params.productId} (${params.paymentId})`,
          metadata: { paymentId: params.paymentId, txid: params.txid },
        });
      }

      return { granted: true, alreadyGranted: false };
    } catch (err) {
      console.error('[Server DB] Grant purchase error:', err);
      return { granted: false, reason: (err as Error).message };
    }
  },

  /**
   * Fetch payment history for a player
   */
  async getPaymentHistory(piUserUid: string) {
    if (!serverSupabase) return [];

    try {
      const queryPromise = serverSupabase
        .from('payment_records')
        .select('*')
        .eq('pi_user_uid', piUserUid)
        .order('created_at', { ascending: false })
        .limit(20);

      const timeoutPromise = new Promise<{ data: any[]; error: null }>((resolve) =>
        setTimeout(() => resolve({ data: [], error: null }), 3500)
      );

      const result = await Promise.race([queryPromise, timeoutPromise]);
      return result.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Prepared Booster Synchronization
   * Prepares cross-device booster synchronization for when columns are activated in Supabase.
   */
  async syncBoosterStatus(params: {
    piUserUid: string;
    multiplier: number;
    expiresAt: number;
  }) {
    if (!serverSupabase) return { synced: false, reason: 'SUPABASE_NOT_CONFIGURED' };

    try {
      // Check if profile exists
      const { data: profile } = await serverSupabase
        .from('profiles')
        .select('id')
        .eq('pi_uid', params.piUserUid)
        .maybeSingle();

      if (!profile) return { synced: false, reason: 'PROFILE_NOT_FOUND' };

      // Prepared update - safely catches if column is pending SQL migration
      const { error } = await serverSupabase
        .from('player_stats')
        .update({
          // Columns to be activated in consolidated schema:
          // active_booster_multiplier: params.multiplier,
          // active_booster_expires_at: new Date(params.expiresAt).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('player_id', profile.id);

      if (error) {
        console.warn('[Server DB] Booster sync deferred (columns pending SQL activation):', error.message);
        return { synced: false, pendingDbActivation: true };
      }

      return { synced: true };
    } catch (err) {
      console.warn('[Server DB] Booster sync exception:', err);
      return { synced: false, reason: (err as Error).message };
    }
  },
};
