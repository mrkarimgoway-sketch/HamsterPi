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
  },

  async syncPlayerMiningStats(data: {
    piUid: string;
    username: string;
    passiveRatePerHour: number;
    passiveRatePerSec: number;
    points: number;
    level: number;
    levelTitle: string;
    skin: string;
  }) {
    try {
      await fetch('/api/player/sync-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Non-blocking sync
    }
  },

  async fetchTopMinersLeaderboard(): Promise<any[]> {
    // 1. Try server backend endpoint
    try {
      const res = await fetch('/api/leaderboard/miners');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success && Array.isArray(json.miners) && json.miners.length > 0) {
          return json.miners.map((item: any, index: number) => ({
            rank: index + 1,
            username: item.pi_username || item.username || `Pioneer_${index + 1}`,
            level: item.level || 1,
            levelTitle: item.level_title || 'Bronze Forager',
            miningRatePerHour: Number(item.passive_rate_per_hour || 0),
            miningRatePerSec: Number(item.passive_rate_per_sec || 0),
            totalPoints: Number(item.points || 0),
            skin: item.current_skin || 'default',
          }));
        }
      }
    } catch {
      // fallback to direct client query
    }

    // 2. Direct client Supabase query if available
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('top_100_miners')
          .select('*')
          .limit(100);

        if (!error && data && data.length > 0) {
          return data.map((item: any, index: number) => ({
            rank: index + 1,
            username: item.pi_username || item.username || `Pioneer_${index + 1}`,
            level: item.level || 1,
            levelTitle: item.level_title || 'Bronze Forager',
            miningRatePerHour: Number(item.passive_rate_per_hour || 0),
            miningRatePerSec: Number(item.passive_rate_per_sec || 0),
            totalPoints: Number(item.points || 0),
            skin: item.current_skin || 'default',
          }));
        }
      } catch (err) {
        console.warn('Direct Supabase leaderboard query failed:', err);
      }
    }

    return [];
  }
};
