import React from 'react';
import type { Expense, SessionContact } from '../../../types';
import { ExpenseCard } from './ExpenseCard';
import { EmptyState } from '../../common/EmptyState';
import { Button } from '../../common/Button';

interface ExpenseListProps {
  expenses: Expense[];
  contacts: SessionContact[];
  onEdit: (expenseId: string) => void;
  onDelete: (expenseId: string) => void;
  onAdd: () => void;
}

export function ExpenseList({ expenses, contacts, onEdit, onDelete, onAdd }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        title="No expenses yet"
        description="Add your first expense to start splitting"
        action={<Button onClick={onAdd}>Add expense</Button>}
      />
    );
  }

  return (
    <div className="space-y-3">
      {[...expenses]
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            contacts={contacts}
            onEdit={() => onEdit(expense.id)}
            onDelete={() => onDelete(expense.id)}
          />
        ))}
    </div>
  );
}
