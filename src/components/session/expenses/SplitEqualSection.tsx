import type { SessionContact, ParticipantId } from '../../../types';
import { formatCurrency } from '../../../utils/currency';
import { computeEqualSplits } from '../../../utils/splits';

interface SplitEqualSectionProps {
  contacts: SessionContact[];
  participantIds: ParticipantId[];
  amount: number;
  onToggleParticipant: (id: ParticipantId) => void;
}

export function SplitEqualSection({
  contacts,
  participantIds,
  amount,
  onToggleParticipant,
}: SplitEqualSectionProps) {
  const splits = computeEqualSplits(amount, participantIds);

  const splitAmountFor = (id: ParticipantId) =>
    splits.find((s) => s.participantId === id)?.amount ?? 0;

  return (
    <div className="space-y-1">
      {contacts.map((contact) => {
        const checked = participantIds.includes(contact.contactId);
        return (
          <label
            key={contact.contactId}
            className={[
              'flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors',
              checked ? 'bg-indigo-50' : 'hover:bg-gray-50',
            ].join(' ')}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggleParticipant(contact.contactId)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-800 flex-1">{contact.name}</span>
            {checked && amount > 0 && (
              <span className="text-sm font-medium text-indigo-700">
                {formatCurrency(splitAmountFor(contact.contactId))}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}
