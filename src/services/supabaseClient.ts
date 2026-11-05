import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface GameTransactionInput {
  playerId: string;
  amount: number;
  balanceAfter: number;
  category: 'tap_batch' | 'upgrade_purchase' | 'passive_income' | 'daily_reward' | 'mission_reward' | 'minigame_reward' | 'referral_bonus' | 'admin_adjustment' | 'skin_purchase';
  description: string;
  metadata?: Record<string, unknown>;
}

export const dbService = {
  async recordTransaction(tx: GameTransactionInput) {
    if (supabase) {
      try {
        await supabase.from('game_transactions').insert({
          player_id: tx.playerId,
          amount: tx.amount,
          balance_after: tx.balanceAfter,
          category: tx.category,
          description: tx.description,
          metadata: tx.metadata || {},
          idempotency_key: `${tx.playerId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        });
      } catch (err) {
        console.warn('Failed to record transaction to Supabase:', err);
      }
    }
  },

  async syncTapBatch(playerId: string, tapCount: number, durationMs: number, pointsAwarded: number, energyConsumed: number) {
    if (supabase) {
      try {
        await supabase.from('tap_sessions').insert({
          player_id: playerId,
          tap_count: tapCount,
          duration_ms: durationMs,
          points_awarded: pointsAwarded,
          energy_consumed: energyConsumed,
          client_timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Failed to sync tap session:', err);
      }
    }
  },

  async recordMiniGameResult(playerId: string, gameKey: string, score: number, rewardPoints: number) {
    if (supabase) {
      try {
        await supabase.from('game_sessions').insert({
          player_id: playerId,
          game_key: gameKey,
          raw_score: score,
          reward_awarded: rewardPoints,
          verified: true,
          ended_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Failed to record minigame session:', err);
      }
    }
  }
};
