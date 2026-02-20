import { useAppContext } from '../AppContext';
import type { SessionContact } from '../../types';

export function useSessionContacts(sessionId: string): SessionContact[] {
  const { state } = useAppContext();
  const session = state.sessions.find((s) => s.id === sessionId);
  return session?.contacts ?? [];
}
