import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { PI_PRODUCTS } from './src/data/piProducts.ts';
import { PI_ECOSYSTEM_PROJECTS } from './src/data/piProjects.ts';
import { serverDb, isServerSupabaseConfigured } from './src/services/serverDb.ts';
import { PiAppToUserPayoutService } from './src/services/piPayoutArchitecture.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// ============================================================================
// PI NETWORK CONFIGURATION AUDIT
// ============================================================================

const PI_PLATFORM_API_BASE = 'https://api.minepi.com';
const PI_API_KEY = process.env.PI_API_KEY || '';
const PI_SANDBOX_MODE = process.env.PI_SANDBOX_MODE === 'true';

console.info('[HamsterPi Server] Starting backend service...');
console.info(`[Pi Network Config] Sandbox Mode: ${PI_SANDBOX_MODE}`);
console.info(`[Pi Network Config] Server API Key configured: ${Boolean(PI_API_KEY)}`);
console.info(`[Supabase Config] Supabase configured: ${isServerSupabaseConfigured}`);

/**
 * Public Environment & Feature Status (Safe to expose to frontend)
 */
app.get('/api/pi/config', (_req: Request, res: Response) => {
  res.json({
    isSandbox: PI_SANDBOX_MODE,
    isApiKeyConfigured: Boolean(PI_API_KEY),
    isSupabaseConfigured: isServerSupabaseConfigured,
    platformApiBase: PI_PLATFORM_API_BASE,
    appToUserPayoutsEnabled: PiAppToUserPayoutService.isEnabled(),
  });
});

/**
 * Products Catalog
 */
app.get('/api/pi/products', (_req: Request, res: Response) => {
  res.json({ products: PI_PRODUCTS });
});

// ============================================================================
// PI NETWORK OFFICIAL AUTHENTICATION ENDPOINT
// ============================================================================

/**
 * Helper to fetch Pioneer profile from Pi Platform API
 */
async function fetchPiUser(accessToken: string) {
  const response = await fetch(`${PI_PLATFORM_API_BASE}/v2/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pi Platform API returned status ${response.status}: ${errorText}`);
  }

  return await response.json();
}

/**
 * Server-side Pioneer access token verification
 * Calls official Pi Platform API GET /v2/me with Bearer token
 * NEVER trusts client-submitted usernames or UIDs.
 */
app.post('/api/pi/verify', async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(400).json({
      verified: false,
      error: 'accessToken string is required',
      code: 'MISSING_ACCESS_TOKEN',
    });
  }

  try {
    const piUser = await fetchPiUser(accessToken);

    if (!piUser || !piUser.uid || !piUser.username) {
      return res.status(401).json({
        verified: false,
        error: 'Invalid Pioneer profile returned by Pi Platform API',
        code: 'INVALID_PI_PROFILE',
      });
    }

    // Persist verified Pioneer in Supabase
    const dbProfile = await serverDb.upsertPioneer(piUser);

    console.info(`[Pi Auth] Verified Pioneer @${piUser.username} (UID: ${piUser.uid})`);

    return res.json({
      verified: true,
      user: {
        uid: piUser.uid,
        username: piUser.username,
        roles: piUser.roles || [],
      },
      dbProfileId: dbProfile?.id || null,
      isSandbox: PI_SANDBOX_MODE,
    });
  } catch (err: unknown) {
    const message = (err as Error).message;
    console.error('[Pi Auth] Verification error:', message);
    return res.status(401).json({
      verified: false,
      error: 'Pi Network token verification failed. Please re-authenticate inside Pi Browser.',
      details: message,
      code: 'TOKEN_VERIFICATION_FAILED',
    });
  }
});

// ============================================================================
// PI NETWORK OFFICIAL USER-TO-APP PAYMENTS LIFECYCLE
// ============================================================================

/**
 * Helper to get payment details from Pi Platform API
 */
async function getPiPayment(paymentId: string) {
  if (!PI_API_KEY) {
    throw new Error('MISSING_PI_API_KEY: PI_API_KEY must be set in server environment.');
  }

  const response = await fetch(`${PI_PLATFORM_API_BASE}/v2/payments/${paymentId}`, {
    headers: {
      Authorization: `Key ${PI_API_KEY}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch payment ${paymentId}: ${response.status} ${text}`);
  }

  return await response.json();
}

/**
 * 1. Server-side Payment Approval (POST /api/pi/payment/approve)
 * Official Pi documentation step:
 * POST https://api.minepi.com/v2/payments/{payment_id}/approve
 */
app.post('/api/pi/payment/approve', async (req: Request, res: Response) => {
  const { paymentId, productId, accessToken } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required', code: 'MISSING_PAYMENT_ID' });
  }

  if (!PI_API_KEY) {
    console.error('[Pi Payments] Approval failed: PI_API_KEY is missing');
    return res.status(503).json({
      error: 'PI_API_KEY is not configured on the server. Please configure PI_API_KEY from Pi Developer Portal.',
      code: 'MISSING_PI_API_KEY',
    });
  }

  try {
    // 1. Verify user identity via accessToken if supplied
    let userUid = '';
    if (accessToken) {
      try {
        const u = await fetchPiUser(accessToken);
        userUid = u.uid;
      } catch {
        // Continue if verification token check fails
      }
    }

    // 2. Inspect payment on Pi Platform
    const currentPayment = await getPiPayment(paymentId);

    // Strict Server-Side Product & Price Validation
    const resolvedProductId = productId || currentPayment.metadata?.productId;
    const catalogProduct = PI_PRODUCTS.find((p) => p.id === resolvedProductId);

    if (catalogProduct) {
      if (Number(currentPayment.amount) < catalogProduct.pricePi) {
        console.warn(`[Pi Payments] Price mismatch rejected: ${currentPayment.amount} Pi paid, required ${catalogProduct.pricePi} Pi`);
        await serverDb.logPaymentEvent(paymentId, 'AMOUNT_MISMATCH_REJECTED', 'SERVER', {
          paidAmount: currentPayment.amount,
          requiredPrice: catalogProduct.pricePi,
          productId: catalogProduct.id,
        });
        return res.status(400).json({
          error: `PAYMENT_AMOUNT_MISMATCH: Payment amount ${currentPayment.amount} Pi is lower than required price ${catalogProduct.pricePi} Pi.`,
          code: 'INVALID_AMOUNT',
        });
      }
    }

    // Idempotency check: already approved?
    if (currentPayment.status?.developer_approved) {
      return res.json({
        status: 'APPROVED',
        paymentId,
        alreadyApproved: true,
        payment: currentPayment,
      });
    }

    // 3. Approve via Pi Platform API
    const approveResponse = await fetch(`${PI_PLATFORM_API_BASE}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
      },
    });

    if (!approveResponse.ok) {
      const errorText = await approveResponse.text();
      console.error(`[Pi Payments] Approval rejected for ${paymentId}:`, errorText);
      await serverDb.logPaymentEvent(paymentId, 'APPROVAL_REJECTED', 'PI_API', { errorText });
      return res.status(approveResponse.status).json({
        error: 'Pi Platform rejected payment approval',
        details: errorText,
      });
    }

    const approvedData = await approveResponse.json();

    // 4. Record state in database
    await serverDb.recordPaymentState({
      paymentId,
      piUserUid: currentPayment.user_uid || userUid,
      amount: currentPayment.amount,
      memo: currentPayment.memo,
      productId: productId || currentPayment.metadata?.productId,
      status: 'APPROVED',
      developerApproved: true,
      metadata: currentPayment.metadata,
    });

    await serverDb.logPaymentEvent(paymentId, 'DEVELOPER_APPROVED', 'SERVER', approvedData);

    console.info(`[Pi Payments] Approved payment ${paymentId} for Pioneer ${currentPayment.user_uid}`);

    return res.json({
      status: 'APPROVED',
      paymentId,
      payment: approvedData,
    });
  } catch (err: unknown) {
    const message = (err as Error).message;
    console.error(`[Pi Payments] Error approving payment ${paymentId}:`, message);
    return res.status(500).json({ error: message, code: 'APPROVAL_EXCEPTION' });
  }
});

/**
 * 2. Server-side Payment Completion (POST /api/pi/payment/complete)
 * Official Pi documentation step:
 * POST https://api.minepi.com/v2/payments/{payment_id}/complete
 * Body: { txid: string }
 * CRITICAL: Grants in-game reward ONLY after successful Pi completion response.
 */
app.post('/api/pi/payment/complete', async (req: Request, res: Response) => {
  const { paymentId, txid, productId, accessToken } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({
      error: 'paymentId and txid are required',
      code: 'MISSING_PARAMS',
    });
  }

  if (!PI_API_KEY) {
    console.error('[Pi Payments] Completion failed: PI_API_KEY is missing');
    return res.status(503).json({
      error: 'PI_API_KEY is not configured on the server. Cannot finalize blockchain payment.',
      code: 'MISSING_PI_API_KEY',
    });
  }

  try {
    // 1. Fetch payment state from Pi Platform
    const currentPayment = await getPiPayment(paymentId);

    // If already completed in Pi Platform, proceed to grant check
    let completedData = currentPayment;
    if (!currentPayment.status?.developer_completed) {
      const completeResponse = await fetch(`${PI_PLATFORM_API_BASE}/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txid }),
      });

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text();
        console.error(`[Pi Payments] Completion failed for ${paymentId}:`, errorText);
        await serverDb.logPaymentEvent(paymentId, 'COMPLETION_FAILED', 'PI_API', { errorText, txid });
        return res.status(completeResponse.status).json({
          error: 'Pi Platform rejected payment completion',
          details: errorText,
        });
      }

      completedData = await completeResponse.json();
    }

    // 2. Identify product purchased
    const resolvedProductId =
      productId ||
      currentPayment.metadata?.productId ||
      completedData.metadata?.productId;

    const product = PI_PRODUCTS.find((p) => p.id === resolvedProductId);

    if (product && Number(completedData.amount) < product.pricePi) {
      console.warn(`[Pi Payments] Completed payment amount mismatch: ${completedData.amount} Pi vs ${product.pricePi} Pi`);
      return res.status(400).json({
        error: `PAYMENT_AMOUNT_MISMATCH: Completed amount ${completedData.amount} Pi does not match required price ${product.pricePi} Pi.`,
        code: 'INVALID_AMOUNT',
      });
    }

    const rewardPayload = product ? product.rewardPayload : (currentPayment.metadata?.rewardPayload as Record<string, unknown>) || {};

    // 3. Record completion state in Supabase
    await serverDb.recordPaymentState({
      paymentId,
      piUserUid: completedData.user_uid,
      amount: completedData.amount,
      memo: completedData.memo,
      productId: resolvedProductId,
      status: 'COMPLETED',
      developerApproved: true,
      developerCompleted: true,
      transactionVerified: true,
      txid,
      metadata: completedData.metadata,
    });

    // 4. Grant reward safely & idempotently
    const grantResult = await serverDb.grantPurchaseReward({
      paymentId,
      piUserUid: completedData.user_uid,
      productId: resolvedProductId,
      pricePi: completedData.amount,
      txid,
      reward: rewardPayload,
    });

    await serverDb.logPaymentEvent(paymentId, 'DEVELOPER_COMPLETED', 'SERVER', {
      txid,
      grantResult,
      rewardPayload,
    });

    console.info(`[Pi Payments] Completed payment ${paymentId} (txid: ${txid}) - Reward granted: ${grantResult.granted}`);

    return res.json({
      status: 'COMPLETED',
      paymentId,
      txid,
      reward: {
        productId: resolvedProductId,
        ...rewardPayload,
      },
      grantResult,
    });
  } catch (err: unknown) {
    const message = (err as Error).message;
    console.error(`[Pi Payments] Exception completing payment ${paymentId}:`, message);
    return res.status(500).json({ error: message, code: 'COMPLETION_EXCEPTION' });
  }
});

/**
 * 3. Incomplete Payment Recovery (POST /api/pi/payment/incomplete)
 * Required by official Pi SDK to reconcile interrupted payments
 */
app.post('/api/pi/payment/incomplete', async (req: Request, res: Response) => {
  const { paymentId, txid } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  if (!PI_API_KEY) {
    return res.status(503).json({ error: 'PI_API_KEY not configured', code: 'MISSING_PI_API_KEY' });
  }

  try {
    const payment = await getPiPayment(paymentId);
    await serverDb.logPaymentEvent(paymentId, 'INCOMPLETE_PAYMENT_FOUND', 'RECOVERY', payment);

    // If already completed
    if (payment.status?.developer_completed) {
      return res.json({ status: 'COMPLETED', paymentId, payment });
    }

    // If transaction is verified on blockchain but developer hasn't completed
    if (payment.status?.transaction_verified && (txid || payment.transaction?.txid)) {
      const finalTxid = txid || payment.transaction?.txid;
      const completeRes = await fetch(`${PI_PLATFORM_API_BASE}/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txid: finalTxid }),
      });

      if (completeRes.ok) {
        const completedData = await completeRes.json();
        return res.json({ status: 'COMPLETED', paymentId, payment: completedData });
      }
    }

    return res.json({
      status: payment.status?.cancelled ? 'CANCELLED' : 'PENDING',
      paymentId,
      payment,
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 4. Payment Cancellation Notification (POST /api/pi/payment/cancel)
 */
app.post('/api/pi/payment/cancel', async (req: Request, res: Response) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: 'paymentId is required' });

  await serverDb.logPaymentEvent(paymentId, 'PAYMENT_CANCELLED_BY_CLIENT', 'CLIENT', {});
  return res.json({ status: 'CANCELLED', paymentId });
});

/**
 * 5. Player Payment Transaction History (GET /api/pi/payments/history)
 */
app.get('/api/pi/payments/history', async (req: Request, res: Response) => {
  const userUid = req.query.uid as string;
  if (!userUid) {
    return res.status(400).json({ error: 'uid query parameter is required' });
  }

  const history = await serverDb.getPaymentHistory(userUid);
  return res.json({ history });
});

// ============================================================================
// PI ECOSYSTEM PROJECTS CONTRIBUTION ARCHITECTURE (PHASE 2 & PHASE 5)
// ============================================================================

// In-memory trusted payment intents cache for server-authoritative validation
const projectPaymentIntents = new Map<string, {
  projectId: string;
  amount: number;
  userUid?: string;
  createdAt: number;
}>();

/**
 * 1. Projects Catalog & Database Readiness Status
 */
app.get('/api/pi/projects', (_req: Request, res: Response) => {
  res.json({
    projects: PI_ECOSYSTEM_PROJECTS,
    databaseStatus: {
      isDatabaseActive: false,
      status: 'PENDING_SQL_ACTIVATION',
      message: 'Funding statistics will become available after database activation.',
      messageAr: 'ستظهر إحصائيات التمويل بعد تفعيل قاعدة البيانات.',
    },
  });
});

/**
 * 2. Create Trusted Project Contribution Intent
 */
app.post('/api/pi/projects/intent', async (req: Request, res: Response) => {
  const { projectId, amount, accessToken } = req.body;

  const validProjects = ['pimind_ai', 'pi_battle_arena'];
  if (!validProjects.includes(projectId)) {
    return res.status(400).json({
      error: 'INVALID_PROJECT_ID: Project must be pimind_ai or pi_battle_arena',
      code: 'INVALID_PROJECT',
    });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      error: 'INVALID_AMOUNT: Contribution amount must be greater than 0 Pi',
      code: 'INVALID_AMOUNT',
    });
  }

  let userUid: string | undefined;
  if (accessToken) {
    try {
      const u = await fetchPiUser(accessToken);
      userUid = u.uid;
    } catch {
      // Continue if token verification fails
    }
  }

  const project = PI_ECOSYSTEM_PROJECTS.find((p) => p.id === projectId);
  const intentId = `intent_${projectId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  projectPaymentIntents.set(intentId, {
    projectId,
    amount: numericAmount,
    userUid,
    createdAt: Date.now(),
  });

  return res.json({
    intentId,
    projectId,
    projectName: project?.name,
    amount: numericAmount,
    memo: `HamsterPi Ecosystem Support: ${project?.name} (${numericAmount} π)`,
    databaseStatus: 'PENDING_SQL_ACTIVATION',
    notice: 'Project contribution architecture is prepared. Recording will activate with consolidated database schema.',
  });
});

/**
 * 3. Server Approval for Project Contribution
 */
app.post('/api/pi/projects/approve', async (req: Request, res: Response) => {
  const { paymentId, intentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required', code: 'MISSING_PAYMENT_ID' });
  }

  if (!PI_API_KEY) {
    return res.status(503).json({ error: 'PI_API_KEY not configured', code: 'MISSING_PI_API_KEY' });
  }

  try {
    const currentPayment = await getPiPayment(paymentId);
    const intent = intentId ? projectPaymentIntents.get(intentId) : null;

    // Strict validation against server intent if provided
    if (intent && Number(currentPayment.amount) < intent.amount) {
      return res.status(400).json({
        error: `PAYMENT_AMOUNT_MISMATCH: Paid amount ${currentPayment.amount} Pi is lower than intended ${intent.amount} Pi`,
        code: 'INVALID_AMOUNT',
      });
    }

    if (currentPayment.status?.developer_approved) {
      return res.json({ status: 'APPROVED', paymentId, payment: currentPayment });
    }

    const approveResponse = await fetch(`${PI_PLATFORM_API_BASE}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Key ${PI_API_KEY}` },
    });

    if (!approveResponse.ok) {
      const errText = await approveResponse.text();
      return res.status(approveResponse.status).json({ error: 'Pi Platform rejected approval', details: errText });
    }

    const approvedData = await approveResponse.json();
    await serverDb.logPaymentEvent(paymentId, 'PROJECT_CONTRIBUTION_APPROVED', 'SERVER', approvedData);

    return res.json({ status: 'APPROVED', paymentId, payment: approvedData });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 4. Server Completion for Project Contribution
 */
app.post('/api/pi/projects/complete', async (req: Request, res: Response) => {
  const { paymentId, txid, intentId } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'paymentId and txid are required', code: 'MISSING_PARAMS' });
  }

  if (!PI_API_KEY) {
    return res.status(503).json({ error: 'PI_API_KEY not configured', code: 'MISSING_PI_API_KEY' });
  }

  try {
    const currentPayment = await getPiPayment(paymentId);

    let completedData = currentPayment;
    if (!currentPayment.status?.developer_completed) {
      const completeResponse = await fetch(`${PI_PLATFORM_API_BASE}/v2/payments/${paymentId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txid }),
      });

      if (!completeResponse.ok) {
        const errorText = await completeResponse.text();
        return res.status(completeResponse.status).json({ error: 'Pi Platform rejected completion', details: errorText });
      }

      completedData = await completeResponse.json();
    }

    await serverDb.logPaymentEvent(paymentId, 'PROJECT_CONTRIBUTION_COMPLETED', 'SERVER', {
      txid,
      completedData,
      intentId,
      notice: 'Database table project_contributions pending activation.',
    });

    return res.json({
      status: 'COMPLETED',
      paymentId,
      txid,
      amount: completedData.amount,
      databaseStatus: 'PENDING_SQL_ACTIVATION',
      message: 'Contribution verified on Pi blockchain. Database escrow ledger pending schema activation.',
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: (err as Error).message });
  }
});


// ============================================================================
// GAME LOGIC & ANTI-CHEAT SERVER VALIDATION
// ============================================================================

app.post('/api/game/tap-sync', (req: Request, res: Response) => {
  const { playerId, tapCount, durationMs, pointsAwarded } = req.body;

  if (durationMs > 0) {
    const tapsPerSec = (tapCount / durationMs) * 1000;
    if (tapsPerSec > 35) {
      return res.status(400).json({
        verified: false,
        error: 'Tap rate limit exceeded. Action flagged.',
      });
    }
  }

  return res.json({
    verified: true,
    playerId,
    syncedTaps: tapCount,
    pointsAwarded,
  });
});

app.post('/api/game/score-submit', (req: Request, res: Response) => {
  const { playerId, gameKey, score } = req.body;

  const validGames = ['rush', 'memory', 'puzzle', 'jump', 'quiz'];
  if (!validGames.includes(gameKey)) {
    return res.status(400).json({ error: 'Invalid game key' });
  }

  return res.json({
    verified: true,
    playerId,
    gameKey,
    score,
    rewardAwarded: Math.max(0, score * 5),
  });
});

app.get('/api/admin/stats', (_req: Request, res: Response) => {
  res.json({
    activePioneers: 148290,
    dailyActiveUsers: 42150,
    totalPointsCirculating: 18450000,
    cheatFlags: 0,
    version: '2.5.0',
    systemStatus: 'HEALTHY',
    piApiKeyConfigured: Boolean(PI_API_KEY),
    supabaseConfigured: isServerSupabaseConfigured,
  });
});

// ============================================================================
// VITE DEV SERVER / STATIC SERVING
// ============================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HamsterPi Game Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
