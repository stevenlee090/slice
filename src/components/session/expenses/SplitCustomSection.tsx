import React from 'react';
import type { SessionContact, ParticipantId, ExpenseSplit } from '../../../types';
import { Input } from '../../common/Input';
import { formatCurrency, roundCents } from '../../../utils/currency';

interface SplitCustomSectionProps {
  contacts: SessionContact[];
  participantIds: ParticipantId[];
  totalAmount: number;
  splits: ExpenseSplit[];
  onToggleParticipant: (id: ParticipantId) => void;
  onSplitAmountChange: (participantId: ParticipantId, amount: number) => void;
}

export function SplitCustomSection({
  contacts,
  participantIds,
  totalAmount,
  splits,
  onToggleParticipant,
  onSplitAmountChange,
}: SplitCustomSectionProps) {
  const splitTotal = roundCents(splits.reduce((sum, s) => sum + s.amount, 0));
  const remaining = roundCents(totalAmount - splitTotal);
  const isValid = Math.abs(remaining) < 0.01;

  return (
    <div className="space-y-2">
      {contacts.map((contact) => {
        const checked = participantIds.includes(contact.contactId);
        const split = splits.find((s) => s.participantId === contact.contactId);
        return (
          <div key={contact.contactId} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggleParticipant(contact.contactId)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
            />
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-800 flex-1">{contact.name}</span>
            {checked && (
              <div className="w-28">
                <Input
                  type="number"
                  prefix="$"
                  value={split?.amount.toString() ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onSplitAmountChange(contact.contactId, isNaN(val) ? 0 : val);
                  }}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Remaining indicator */}
      {totalAmount > 0 && participantIds.length > 0 && (
        <div
          className={[
            'flex items-center justify-between text-xs px-2 py-1.5 rounded-lg mt-2',
            isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
          ].join(' ')}
        >
          <span>{isValid ? 'Splits balance!' : 'Remaining to allocate:'}</span>
          {!isValid && <span className="font-medium">{formatCurrency(Math.abs(remaining))}</span>}
          {isValid && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
