import React from 'react';
import type { Session } from '../../../types';
import { BreakdownExpenseRow } from './BreakdownExpenseRow';
import { CategoryBreakdown } from '../CategoryBreakdown';
import { EmptyState } from '../../common/EmptyState';

interface BreakdownViewProps {
  session: Session;
}

export function BreakdownView({ session }: BreakdownViewProps) {
  if (session.expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses"
        description="Add expenses to see the breakdown"
      />
    );
  }

  return (
    <div>
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">By category</p>
        <CategoryBreakdown expenses={session.expenses} />
      </div>
      <div className="divide-y divide-gray-100">
        {[...session.expenses]
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((expense) => (
            <BreakdownExpenseRow
              key={expense.id}
              expense={expense}
              contacts={session.contacts}
            />
          ))}
      </div>
    </div>
  );
}
