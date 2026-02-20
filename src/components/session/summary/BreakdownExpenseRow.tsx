import { useState } from 'react';
import type { Expense, SessionContact } from '../../../types';
import { Badge } from '../../common/Badge';
import { formatCurrency } from '../../../utils/currency';

interface BreakdownExpenseRowProps {
  expense: Expense;
  contacts: SessionContact[];
}

export function BreakdownExpenseRow({ expense, contacts }: BreakdownExpenseRowProps) {
  const [expanded, setExpanded] = useState(false);

  function getName(id: string): string {
    return contacts.find((c) => c.contactId === id)?.name ?? 'Unknown';
  }

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">
              {expense.description}
            </span>
            <Badge variant={expense.splitMode === 'equal' ? 'indigo' : 'yellow'}>
              {expense.splitMode}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Paid by {getName(expense.payerId)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-gray-900">{formatCurrency(expense.amount)}</span>
          <svg
            className={['w-4 h-4 text-gray-400 transition-transform', expanded ? 'rotate-180' : ''].join(' ')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="ml-2 mb-2 pl-3 border-l-2 border-gray-100 space-y-1">
          {expense.splits.map((split) => (
            <div key={split.participantId} className="flex items-center justify-between text-xs text-gray-600 py-0.5">
              <span>{getName(split.participantId)}</span>
              <span>{formatCurrency(split.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
