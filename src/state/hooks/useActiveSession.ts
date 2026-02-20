import { useAppContext } from '../AppContext';
import type { Session } from '../../types';

export function useActiveSession(): Session | null {
  const { state } = useAppContext();
  if (!state.activeSessionId) return null;
  return state.sessions.find((s) => s.id === state.activeSessionId) ?? null;
}
