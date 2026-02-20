import type { SessionContact } from '../../../types';
import type { Transaction, NetBalance } from '../../../utils/settlement';
import { TransactionRow } from './TransactionRow';
import { Badge } from '../../common/Badge';
import { formatCurrency } from '../../../utils/currency';
import { EmptyState } from '../../common/EmptyState';

interface MinimizedViewProps {
  transactions: Transaction[];
  balances: NetBalance[];
  contacts: SessionContact[];
}

export function MinimizedView({ transactions, balances, contacts }: MinimizedViewProps) {
  function getName(id: string): string {
    return contacts.find((c) => c.contactId === id)?.name ?? 'Unknown';
  }

  if (transactions.length === 0 && balances.length === 0) {
    return (
      <EmptyState
        title="All settled up!"
        description="No transactions needed"
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-green-400 mb-2">
          <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">All settled up!</p>
        <p className="text-xs text-gray-500">Everyone's even</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Net balances */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Net balances
        </h3>
        <div className="space-y-2">
          {balances.map((balance) => (
            <div
              key={balance.participantId}
              className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-sm text-gray-700">{getName(balance.participantId)}</span>
              <Badge variant={balance.net >= 0 ? 'green' : 'red'}>
                {balance.net >= 0 ? '+' : '-'}
                {formatCurrency(Math.abs(balance.net))}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Settle up ({transactions.length} payment{transactions.length !== 1 ? 's' : ''})
        </h3>
        <div className="divide-y divide-gray-100">
          {transactions.map((t, i) => (
            <TransactionRow key={i} transaction={t} contacts={contacts} />
          ))}
        </div>
      </div>
    </div>
  );
}
