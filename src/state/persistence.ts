import type { PersistedState } from '../types';
import { debounce } from '../utils/debounce';

const STORAGE_KEY = 'BILL_SPLITTER_STATE';

const DEFAULT_STATE: PersistedState = {
  settings: { meName: 'Me', currency: '$' },
  sessions: [],
  activeSessionId: null,
};

/**
 * Migrate persisted state for future schema versioning.
 */
function migrateState(raw: unknown): PersistedState {
  if (!raw || typeof raw !== 'object') return DEFAULT_STATE;
  const state = { ...DEFAULT_STATE, ...(raw as Partial<PersistedState>) };
  // Backfill category: 'other' on existing expenses that lack it
  state.sessions = state.sessions.map((s) => ({
    ...s,
    expenses: s.expenses.map((e) => ({ category: 'other' as const, ...e })),
  }));
  return state;
}

export function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return migrateState(JSON.parse(raw));
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or other error — fail silently
  }
}

export const persistState = debounce(writeState, 300);

export function extractPersistedState(state: PersistedState): PersistedState {
  return {
    settings: state.settings,
    sessions: state.sessions,
    activeSessionId: state.activeSessionId,
  };
}
