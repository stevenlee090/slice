import React from 'react';
import { useAppContext } from '../../state/AppContext';
import { useSettlement } from '../../state/hooks/useSettlement';
import { CategoryBreakdown } from './CategoryBreakdown';
import { formatCurrency } from '../../utils/currency';

interface RightPanelProps {
  sessionId: string;
}

export function RightPanel({ sessionId }: RightPanelProps) {
  const { state } = useAppContext();
  const session = state.sessions.find((s) => s.id === sessionId);
  const { balances, transactions } = useSettlement(sessionId);

  if (!session) return null;

  function getName(participantId: string): string {
    if (participantId === 'me') return session!.contacts.find((c) => c.contactId === 'me')?.name ?? 'Me';
    return session!.contacts.find((c) => c.contactId === participantId)?.name ?? 'Unknown';
  }

  return (
    <aside className="hidden lg:block w-80 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-l border-gray-200 p-4 space-y-6">
      {/* Category Breakdown */}
      {session.expenses.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Categories
          </h3>
          <CategoryBreakdown expenses={session.expenses} />
        </div>
      )}

      {/* Net Balances */}
      {balances.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Net Balances
          </h3>
          <div className="space-y-2">
            {balances.map((b) => (
              <div key={b.participantId} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{getName(b.participantId)}</span>
                <span className={b.net >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {b.net >= 0 ? '+' : ''}{formatCurrency(b.net)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settle Up */}
      {transactions.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Settle Up
          </h3>
          <div className="space-y-2">
            {transactions.map((t, i) => (
              <div key={i} className="text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-medium text-gray-900">{getName(t.fromId)}</span>
                <span className="text-gray-500"> pays </span>
                <span className="font-medium text-gray-900">{getName(t.toId)}</span>
                <div className="text-indigo-600 font-semibold">{formatCurrency(t.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {session.expenses.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">No expenses yet</p>
      )}
    </aside>
  );
}
