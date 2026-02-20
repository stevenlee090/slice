import React, { useState, useEffect } from 'react';
import type { SessionContact, ParticipantId, SplitMode, ExpenseSplit } from '../../../types';
import { CATEGORY_META, type ExpenseCategory } from '../../../utils/categories';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { SplitEqualSection } from './SplitEqualSection';
import { SplitCustomSection } from './SplitCustomSection';
import { computeEqualSplits } from '../../../utils/splits';
import { roundCents } from '../../../utils/currency';

const categoryOptions = Object.entries(CATEGORY_META).map(([v, m]) => ({
  value: v,
  label: `${m.emoji} ${m.label}`,
}));

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  contacts: SessionContact[];
  onSave: (data: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    payerId: ParticipantId;
    participantIds: ParticipantId[];
    splitMode: SplitMode;
    splits: ExpenseSplit[];
  }) => void;
  initialValues?: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    payerId: ParticipantId;
    participantIds: ParticipantId[];
    splitMode: SplitMode;
    splits: ExpenseSplit[];
  };
  title?: string;
}

export function ExpenseForm({
  open,
  onClose,
  contacts,
  onSave,
  initialValues,
  title = 'Add expense',
}: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [payerId, setPayerId] = useState<ParticipantId>('me');
  const [participantIds, setParticipantIds] = useState<ParticipantId[]>(
    contacts.map((c) => c.contactId)
  );
  const [splitMode, setSplitMode] = useState<SplitMode>('equal');
  const [customSplits, setCustomSplits] = useState<ExpenseSplit[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize from initialValues or reset
  useEffect(() => {
    if (open) {
      if (initialValues) {
        setDescription(initialValues.description);
        setAmountStr(initialValues.amount.toString());
        setCategory(initialValues.category ?? 'other');
        setPayerId(initialValues.payerId);
        setParticipantIds(initialValues.participantIds);
        setSplitMode(initialValues.splitMode);
        setCustomSplits(initialValues.splits);
      } else {
        setDescription('');
        setAmountStr('');
        setCategory('other');
        setPayerId('me');
        setParticipantIds(contacts.map((c) => c.contactId));
        setSplitMode('equal');
        setCustomSplits([]);
      }
      setErrors({});
    }
  }, [open, initialValues]);

  const amount = parseFloat(amountStr) || 0;

  function toggleParticipant(id: ParticipantId) {
    setParticipantIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // Update custom splits to reflect new participants
      if (splitMode === 'custom') {
        setCustomSplits((prevSplits) => {
          if (next.includes(id) && !prevSplits.find((s) => s.participantId === id)) {
            return [...prevSplits, { participantId: id, amount: 0 }];
          }
          return prevSplits.filter((s) => next.includes(s.participantId));
        });
      }
      return next;
    });
  }

  function handleSplitModeChange(mode: SplitMode) {
    setSplitMode(mode);
    if (mode === 'custom') {
      // Initialize custom splits from equal splits
      setCustomSplits(computeEqualSplits(amount, participantIds));
    }
  }

  function handleCustomSplitChange(participantId: ParticipantId, value: number) {
    setCustomSplits((prev) => {
      const existing = prev.find((s) => s.participantId === participantId);
      if (existing) {
        return prev.map((s) =>
          s.participantId === participantId ? { ...s, amount: value } : s
        );
      }
      return [...prev, { participantId, amount: value }];
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Description is required';
    if (!amount || amount <= 0) errs.amount = 'Amount must be greater than 0';
    if (participantIds.length === 0) errs.participants = 'Select at least one participant';
    if (splitMode === 'custom') {
      const splitTotal = roundCents(
        customSplits.filter((s) => participantIds.includes(s.participantId)).reduce((sum, s) => sum + s.amount, 0)
      );
      if (Math.abs(splitTotal - amount) > 0.01) {
        errs.splits = 'Custom splits must equal the total amount';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    const finalSplits =
      splitMode === 'equal'
        ? computeEqualSplits(amount, participantIds)
        : customSplits.filter((s) => participantIds.includes(s.participantId));

    onSave({
      description: description.trim(),
      amount,
      category,
      payerId,
      participantIds,
      splitMode,
      splits: finalSplits,
    });
    onClose();
  }

  const payerOptions = contacts.map((c) => ({ value: c.contactId, label: c.name }));

  return (
    <Modal
      title={title}
      open={open}
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Dinner, Taxi"
          error={errors.description}
          autoFocus
          maxLength={120}
        />

        <Input
          label="Amount"
          type="number"
          prefix="$"
          value={amountStr}
          onChange={(e) => {
            setAmountStr(e.target.value);
            if (splitMode === 'custom') {
              const newAmount = parseFloat(e.target.value) || 0;
              setCustomSplits(computeEqualSplits(newAmount, participantIds));
            }
          }}
          min="0"
          step="0.01"
          placeholder="0.00"
          error={errors.amount}
        />

        <Select
          label="Paid by"
          options={payerOptions}
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Split</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {(['equal', 'custom'] as SplitMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleSplitModeChange(mode)}
                  className={[
                    'px-3 py-1 text-xs font-medium transition-colors cursor-pointer',
                    splitMode === mode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {errors.participants && (
            <p className="text-xs text-red-600 mb-2">{errors.participants}</p>
          )}
          {errors.splits && (
            <p className="text-xs text-red-600 mb-2">{errors.splits}</p>
          )}

          {splitMode === 'equal' ? (
            <SplitEqualSection
              contacts={contacts}
              participantIds={participantIds}
              amount={amount}
              onToggleParticipant={toggleParticipant}
            />
          ) : (
            <SplitCustomSection
              contacts={contacts}
              participantIds={participantIds}
              totalAmount={amount}
              splits={customSplits}
              onToggleParticipant={toggleParticipant}
              onSplitAmountChange={handleCustomSplitChange}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
