/** Lock is considered stale after this — a new stream may start (e.g. crashed function). */
export const GENERATION_LOCK_STALE_MS = 10 * 60 * 1000;

export function isGenerationLockStale(generationStartedAt: Date | string | null | undefined): boolean {
  if (!generationStartedAt) return true;
  return Date.now() - new Date(generationStartedAt).getTime() > GENERATION_LOCK_STALE_MS;
}

export function generationLockStaleBefore(): Date {
  return new Date(Date.now() - GENERATION_LOCK_STALE_MS);
}
