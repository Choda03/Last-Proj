declare module '@/lib/rate-limit' {
  export interface RateLimitOptions {
    uniqueTokenPerInterval?: number;
    interval: number;
  }

  export interface RateLimitResult {
    check: (limit: number, token: string) => Promise<void>;
  }

  export function rateLimit(options?: Partial<RateLimitOptions>): RateLimitResult;
}
