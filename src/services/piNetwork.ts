/**
 * Official Pi Network SDK Client Service
 * 
 * Complies with official Pi Platform API specifications:
 * - https://developers.minepi.com/docs/docs/authenticate-user/Authentication
 * - https://developers.minepi.com/docs/accept-payment/Payments
 * - https://developers.minepi.com/docs/api-reference/Platform
 */

import { PiProduct } from '../data/piProducts';

export interface PiUser {
  uid: string;
  username: string;
  roles?: string[];
}

export interface PiAuthResult {
  accessToken: string;
  user: PiUser;
}

export interface PiServerVerificationResult {
  verified: boolean;
  user: PiUser;
  isSandbox: boolean;
  error?: string;
  code?: string;
}

export interface PiPaymentData {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  to_address?: string;
  created_at?: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction?: {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => Promise<void> | void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => Promise<void> | void;
  onCancel: (paymentId: string) => Promise<void> | void;
  onError: (error: Error, payment?: PiPaymentData) => Promise<void> | void;
}

export interface PaymentCompletionResult {
  status: 'COMPLETED' | 'APPROVED' | 'FAILED' | 'CANCELLED';
  paymentId: string;
  txid?: string;
  reward?: {
    productId: string;
    points?: number;
    seeds?: number;
    skin?: string;
    multiplier?: number;
    durationHours?: number;
  };
  error?: string;
}

export type PiInitStatus = 'uninitialized' | 'initializing' | 'ready' | 'not_in_pi_browser' | 'error';

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: PiPaymentData) => void
      ) => Promise<PiAuthResult>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
        },
        callbacks: PiPaymentCallbacks
      ) => void;
      openShareDialog?: (title: string, message: string) => void;
    };
  }
}

class PiNetworkService {
  private initialized: boolean = false;
  private isSandbox: boolean = true;
  private currentUser: PiUser | null = null;
  private token: string | null = null;
  private initStatus: PiInitStatus = 'uninitialized';
  private initError: string | null = null;

  constructor() {
    const envSandbox = import.meta.env.VITE_PI_SANDBOX_MODE;
    if (envSandbox !== undefined) {
      this.isSandbox = envSandbox === 'true';
    } else {
      // Default to sandbox unless explicitly in production
      this.isSandbox = true;
    }

    // Restore cached session token if available
    if (typeof localStorage !== 'undefined') {
      const savedToken = localStorage.getItem('hamsterpi_pi_token');
      const savedUser = localStorage.getItem('hamsterpi_pi_user');
      if (savedToken && savedUser) {
        try {
          this.token = savedToken;
          this.currentUser = JSON.parse(savedUser);
        } catch {
          // ignore cache read error
        }
      }
    }
  }

  /**
   * Detects if the current environment is running inside the official Pi Browser
   */
  public isPiBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const hasPiObject = Boolean(window.Pi);
    const hasPiUa = /PiBrowser/i.test(ua);
    return hasPiObject || hasPiUa;
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && Boolean(window.Pi);
  }

  public getInitStatus(): PiInitStatus {
    return this.initStatus;
  }

  public getInitError(): string | null {
    return this.initError;
  }

  public getIsSandbox(): boolean {
    return this.isSandbox;
  }

  public setSandboxMode(sandbox: boolean) {
    if (this.isSandbox !== sandbox) {
      this.isSandbox = sandbox;
      this.initialized = false;
      this.initStatus = 'uninitialized';
      this.init();
    }
  }

  /**
   * Initializes the official Pi Network JavaScript SDK
   */
  public async init(): Promise<boolean> {
    if (this.initialized) return true;

    if (typeof window === 'undefined') {
      this.initStatus = 'uninitialized';
      return false;
    }

    if (!window.Pi) {
      if (this.isPiBrowser()) {
        // Pi Browser present but SDK script tag still loading; wait briefly
        this.initStatus = 'initializing';
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (window.Pi) {
      try {
        this.initStatus = 'initializing';
        window.Pi.init({
          version: '2.0',
          sandbox: this.isSandbox,
        });
        this.initialized = true;
        this.initStatus = 'ready';
        this.initError = null;
        console.info(`[Pi SDK] Successfully initialized (version: 2.0, sandbox: ${this.isSandbox})`);
        return true;
      } catch (err) {
        this.initStatus = 'error';
        this.initError = (err as Error)?.message || 'Failed to initialize Pi SDK';
        console.error('[Pi SDK] Initialization error:', err);
        return false;
      }
    } else {
      this.initStatus = 'not_in_pi_browser';
      console.info('[Pi SDK] Pi Browser SDK not detected. Pi features require opening inside Pi Browser.');
      return false;
    }
  }

  /**
   * Authenticate Pioneer with the official Pi Network SDK
   * Never fabricates fake credentials or simulated successes.
   */
  public async authenticate(
    onIncompletePaymentFound?: (payment: PiPaymentData) => void
  ): Promise<PiServerVerificationResult> {
    await this.init();

    if (!this.isAvailable() || !window.Pi) {
      throw new Error(
        'PI_BROWSER_REQUIRED: Authentication must be performed inside the official Pi Browser app (pi:// or Pi Browser mobile app).'
      );
    }

    const defaultIncompleteHandler = (payment: PiPaymentData) => {
      console.warn('[Pi Payments] Incomplete payment found during authentication:', payment);
      this.resolveIncompletePayment(payment).catch((err) =>
        console.error('[Pi Payments] Failed to resolve incomplete payment:', err)
      );
      if (onIncompletePaymentFound) {
        onIncompletePaymentFound(payment);
      }
    };

    try {
      // Official Pi SDK call
      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        defaultIncompleteHandler
      );

      if (!authResult || !authResult.accessToken) {
        throw new Error('NO_TOKEN_RETURNED: Pi Network did not return an access token.');
      }

      this.token = authResult.accessToken;

      // Mandatory Server-Side Verification via /api/pi/verify
      const verifyResponse = await fetch('/api/pi/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: authResult.accessToken }),
      });

      const verifyData: PiServerVerificationResult = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.verified) {
        const errorMsg =
          verifyData.error || `Server verification failed with status ${verifyResponse.status}`;
        throw new Error(errorMsg);
      }

      this.currentUser = verifyData.user;

      // Cache token and user securely in localStorage for session persistence
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('hamsterpi_pi_token', authResult.accessToken);
        localStorage.setItem('hamsterpi_pi_user', JSON.stringify(verifyData.user));
      }

      return verifyData;
    } catch (err: unknown) {
      const error = err as Error;
      if (error?.message?.includes('USER_CANCELLED') || error?.name === 'UserCancelledError') {
        throw new Error('USER_CANCELLED: Pioneer cancelled Pi Network authentication.');
      }
      throw error;
    }
  }

  /**
   * Handles and recovers incomplete payments found by the Pi SDK
   */
  public async resolveIncompletePayment(payment: PiPaymentData): Promise<PaymentCompletionResult> {
    try {
      const res = await fetch('/api/pi/payment/incomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.identifier,
          txid: payment.transaction?.txid,
          accessToken: this.token,
        }),
      });
      return await res.json();
    } catch (err) {
      console.error('[Pi Payments] Incomplete payment recovery failed:', err);
      return {
        status: 'FAILED',
        paymentId: payment.identifier,
        error: (err as Error)?.message || 'Failed to reconcile incomplete payment',
      };
    }
  }

  /**
   * Initiates an official Pi Payment for a product
   */
  public createPayment(
    product: PiProduct,
    callbacks: {
      onSuccess: (result: PaymentCompletionResult) => void;
      onCancel: (paymentId: string) => void;
      onError: (error: Error, payment?: PiPaymentData) => void;
      onProgress?: (step: 'approving' | 'awaiting_signature' | 'completing') => void;
    }
  ) {
    if (!this.isAvailable() || !window.Pi) {
      callbacks.onError(
        new Error(
          'PI_BROWSER_REQUIRED: Pi payments can only be processed inside the official Pi Browser.'
        )
      );
      return;
    }

    if (!this.token) {
      callbacks.onError(
        new Error(
          'UNAUTHENTICATED: Please sign in with your Pi Network account before making a purchase.'
        )
      );
      return;
    }

    const paymentData = {
      amount: product.pricePi,
      memo: `HamsterPi: ${product.name}`,
      metadata: {
        productId: product.id,
        productName: product.name,
        rewardType: product.rewardType,
        rewardPayload: product.rewardPayload,
        clientTimestamp: Date.now(),
      },
    };

    window.Pi.createPayment(paymentData, {
      onReadyForServerApproval: async (paymentId: string) => {
        try {
          if (callbacks.onProgress) callbacks.onProgress('approving');

          const response = await fetch('/api/pi/payment/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId,
              productId: product.id,
              accessToken: this.token,
            }),
          });

          const data = await response.json();
          if (!response.ok || data.error) {
            throw new Error(data.error || 'Server rejected payment approval.');
          }

          if (callbacks.onProgress) callbacks.onProgress('awaiting_signature');
        } catch (err) {
          callbacks.onError(err as Error);
        }
      },

      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        try {
          if (callbacks.onProgress) callbacks.onProgress('completing');

          const response = await fetch('/api/pi/payment/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId,
              txid,
              productId: product.id,
              accessToken: this.token,
            }),
          });

          const result: PaymentCompletionResult = await response.json();

          if (!response.ok || result.status !== 'COMPLETED') {
            throw new Error(result.error || 'Server failed to finalize payment completion.');
          }

          callbacks.onSuccess(result);
        } catch (err) {
          callbacks.onError(err as Error);
        }
      },

      onCancel: async (paymentId: string) => {
        try {
          await fetch('/api/pi/payment/cancel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, accessToken: this.token }),
          });
        } catch {
          // ignore cancellation report error
        }
        callbacks.onCancel(paymentId);
      },

      onError: (error: Error, payment?: PiPaymentData) => {
        console.error('[Pi SDK] Payment error:', error, payment);
        callbacks.onError(error, payment);
      },
    });
  }

  public getCurrentUser(): PiUser | null {
    return this.currentUser;
  }

  public getAccessToken(): string | null {
    return this.token;
  }

  public signOut() {
    this.token = null;
    this.currentUser = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('hamsterpi_pi_token');
      localStorage.removeItem('hamsterpi_pi_user');
    }
  }
}

export const piNetwork = new PiNetworkService();
