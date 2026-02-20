import { useState } from 'react';
import type { Expense, SessionContact } from '../../../types';
import { CATEGORY_META } from '../../../utils/categories';
import { Button } from '../../common/Button';
import { Badge } from '../../common/Badge';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { formatCurrency } from '../../../utils/currency';

interface ExpenseCardProps {
  expense: Expense;
  contacts: SessionContact[];
  onEdit: () => void;
  onDelete: () => void;
}

export function ExpenseCard({ expense, contacts, onEdit, onDelete }: ExpenseCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function getName(participantId: string): string {
    if (participantId === 'me') return contacts.find((c) => c.contactId === 'me')?.name ?? 'Me';
    return contacts.find((c) => c.contactId === participantId)?.name ?? 'Unknown';
  }

  const payerName = getName(expense.payerId);

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span>{CATEGORY_META[expense.category ?? 'other'].emoji}</span>
              <span className="font-medium text-gray-900 truncate">{expense.description}</span>
              <Badge variant={expense.splitMode === 'equal' ? 'indigo' : 'yellow'}>
                {expense.splitMode}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">Paid by {payerName}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(expense.amount)}
            </span>
          </div>
        </div>

        {/* Splits detail */}
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          {expense.splits.map((split) => (
            <div key={split.participantId} className="flex items-center justify-between text-xs text-gray-600">
              <span>{getName(split.participantId)}</span>
              <span>{formatCurrency(split.amount)}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
            <span className="text-red-500">Delete</span>
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete expense"
        message={`Delete "${expense.description}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete();
          setConfirmOpen(false);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
