import { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { computeSettlement } from '../../utils/settlement';
import type { Transaction, NetBalance } from '../../utils/settlement';

export function useSettlement(sessionId: string): {
  balances: NetBalance[];
  transactions: Transaction[];
} {
  const { state } = useAppContext();
  const session = state.sessions.find((s) => s.id === sessionId);

  return useMemo(() => {
    if (!session) return { balances: [], transactions: [] };
    return computeSettlement(session.expenses);
  }, [session]);
}
