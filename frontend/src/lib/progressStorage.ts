import type { CompletionMap } from '../types/progress'

export const PROGRESS_STORAGE_KEY = 'star-track.demo.degree-progress.v1'

export function readProgressFromStorage(
  storage: Pick<Storage, 'getItem'> = localStorage,
): CompletionMap | null {
  try {
    const raw = storage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as CompletionMap
  } catch {
    return null
  }
}

export function writeProgressToStorage(
  completions: CompletionMap,
  storage: Pick<Storage, 'setItem'> = localStorage,
): void {
  storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completions))
}

export function clearProgressStorage(
  storage: Pick<Storage, 'removeItem'> = localStorage,
): void {
  storage.removeItem(PROGRESS_STORAGE_KEY)
}
