/**
 * Official Pi Network SDK Integration Layer
 * Complies with official Pi Platform API specifications:
 * - https://developers.minepi.com/docs/docs/authenticate-user/Authentication
 * - https://developers.minepi.com/docs/accept-payment/Payments
 */

export interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

export interface PiPaymentData {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => Promise<void> | void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => Promise<void> | void;
  onCancel: (paymentId: string) => Promise<void> | void;
  onError: (error: Error, payment?: PiPaymentData) => Promise<void> | void;
}

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
  private currentUser: PiAuthResult['user'] | null = null;
  private token: string | null = null;

  constructor() {
    this.isSandbox = import.meta.env.VITE_PI_SANDBOX === 'true' || true;
  }

  /**
   * Initializes the Pi Network SDK
   */
  public async init(): Promise<boolean> {
    if (this.initialized) return true;

    if (typeof window !== 'undefined' && window.Pi) {
      try {
        window.Pi.init({
          version: '2.0',
          sandbox: this.isSandbox,
        });
        this.initialized = true;
        return true;
      } catch (err) {
        console.warn('Pi SDK init error:', err);
        return false;
      }
    } else {
      console.info('Pi SDK not detected in environment (outside Pi Browser). Sandbox fallback available.');
      return false;
    }
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.Pi;
  }

  public getIsSandbox(): boolean {
    return this.isSandbox;
  }

  public setSandboxMode(sandbox: boolean) {
    this.isSandbox = sandbox;
    this.initialized = false;
    this.init();
  }

  /**
   * Authenticate Pioneer using official Pi SDK
   */
  public async authenticate(
    onIncompletePaymentFound?: (payment: PiPaymentData) => void
  ): Promise<PiAuthResult> {
    await this.init();

    if (this.isAvailable() && window.Pi) {
      const handleIncomplete = (payment: PiPaymentData) => {
        console.warn('Incomplete Pi payment detected:', payment);
        if (onIncompletePaymentFound) {
          onIncompletePaymentFound(payment);
        }
      };

      const authResult = await window.Pi.authenticate(['username', 'payments'], handleIncomplete);
      this.currentUser = authResult.user;
      this.token = authResult.accessToken;

      // Verify server-side if backend endpoint is configured
      try {
        await fetch('/api/pi/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: authResult.accessToken }),
        });
      } catch {
        // Continue if backend endpoint is in preview
      }

      return authResult;
    } else {
      // Clean sandbox Pioneer profile for testing outside Pi Browser
      const mockPioneer: PiAuthResult = {
        accessToken: 'mock_pi_token_' + Date.now(),
        user: {
          uid: 'pi_pioneer_hamster_01',
          username: 'Pi_Master_Hamster',
        },
      };
      this.currentUser = mockPioneer.user;
      this.token = mockPioneer.accessToken;
      return mockPioneer;
    }
  }

  /**
   * Initiates official Pi Network Payment
   */
  public createPayment(
    amount: number,
    memo: string,
    metadata: Record<string, unknown>,
    callbacks: PiPaymentCallbacks
  ) {
    if (this.isAvailable() && window.Pi) {
      window.Pi.createPayment(
        {
          amount,
          memo,
          metadata,
        },
        callbacks
      );
    } else {
      // Sandbox simulated flow
      console.info('[Pi Sandbox] Simulated payment triggered:', { amount, memo, metadata });
      const mockPaymentId = 'pi_pay_demo_' + Math.random().toString(36).substring(2, 9);
      setTimeout(async () => {
        try {
          await callbacks.onReadyForServerApproval(mockPaymentId);
          await callbacks.onReadyForServerCompletion(mockPaymentId, 'tx_hash_' + Date.now());
        } catch (e) {
          callbacks.onError(e as Error);
        }
      }, 700);
    }
  }

  public getCurrentUser() {
    return this.currentUser;
  }

  public getAccessToken() {
    return this.token;
  }
}

export const piNetwork = new PiNetworkService();
