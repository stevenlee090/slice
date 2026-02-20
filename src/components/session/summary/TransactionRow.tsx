import React from 'react';
import type { Transaction } from '../../../utils/settlement';
import type { SessionContact } from '../../../types';
import { formatCurrency } from '../../../utils/currency';

interface TransactionRowProps {
  transaction: Transaction;
  contacts: SessionContact[];
}

export function TransactionRow({ transaction, contacts }: TransactionRowProps) {
  function getName(id: string): string {
    return contacts.find((c) => c.contactId === id)?.name ?? 'Unknown';
  }

  const fromName = getName(transaction.fromId);
  const toName = getName(transaction.toId);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-sm font-bold shrink-0">
        {fromName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">
          <span className="font-medium">{fromName}</span>
          <span className="text-gray-400 mx-1.5">→</span>
          <span className="font-medium">{toName}</span>
        </p>
      </div>
      <span className="text-base font-bold text-gray-900 shrink-0">
        {formatCurrency(transaction.amount)}
      </span>
    </div>
  );
}
