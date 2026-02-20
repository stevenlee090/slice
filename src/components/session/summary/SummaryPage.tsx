import { useState } from 'react';
import { useAppContext } from '../../../state/AppContext';
import { useSettlement } from '../../../state/hooks/useSettlement';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../common/Button';
import { MinimizedView } from './MinimizedView';
import { BreakdownView } from './BreakdownView';
import { formatCurrency } from '../../../utils/currency';

interface SummaryPageProps {
  sessionId: string;
}

type SummaryTab = 'settle' | 'breakdown';

export function SummaryPage({ sessionId }: SummaryPageProps) {
  const { state, dispatch } = useAppContext();
  const session = state.sessions.find((s) => s.id === sessionId);
  const { balances, transactions } = useSettlement(sessionId);
  const [activeTab, setActiveTab] = useState<SummaryTab>('settle');

  if (!session) return null;

  const total = session.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <PageHeader
        title="Summary"
        subtitle={session.name}
        backAction={{
          label: 'Session',
          onClick: () =>
            dispatch({
              type: 'NAV_GO',
              payload: { view: { type: 'session', sessionId } },
            }),
        }}
        actions={
          session.status === 'active' ? (
            <Button
              size="sm"
              onClick={() =>
                dispatch({
                  type: 'NAV_GO',
                  payload: { view: { type: 'session', sessionId } },
                })
              }
            >
              + Add expense
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex gap-6">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Expenses</p>
          <p className="text-lg font-bold text-gray-900">{session.expenses.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Payments</p>
          <p className="text-lg font-bold text-gray-900">{transactions.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-4">
        {(['settle', 'breakdown'] as SummaryTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer',
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab === 'settle' ? 'Settle up' : 'Breakdown'}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'settle' ? (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <MinimizedView
              transactions={transactions}
              balances={balances}
              contacts={session.contacts}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-2">
            <BreakdownView session={session} />
          </div>
        )}
      </div>
    </div>
  );
}
