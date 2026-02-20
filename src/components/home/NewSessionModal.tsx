import { useState } from 'react';
import { useAppContext } from '../../state/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { generateId } from '../../utils/uuid';
import type { SessionContact } from '../../types';

interface NewSessionModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewSessionModal({ open, onClose }: NewSessionModalProps) {
  const { state, dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [participantError, setParticipantError] = useState('');
  const [participants, setParticipants] = useState<{ id: string; name: string }[]>([]);

  function handleAddParticipant() {
    const trimmed = participantInput.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (lower === state.settings.meName.toLowerCase()) {
      setParticipantError('That\'s you — already included');
      return;
    }
    if (participants.some((p) => p.name.toLowerCase() === lower)) {
      setParticipantError('Already added');
      return;
    }
    setParticipants((prev) => [...prev, { id: generateId(), name: trimmed }]);
    setParticipantInput('');
    setParticipantError('');
  }

  function handleRemoveParticipant(id: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Session name is required');
      return;
    }
    const contacts: SessionContact[] = [
      { contactId: 'me', name: state.settings.meName },
      ...participants.map((p) => ({ contactId: p.id, name: p.name })),
    ];
    dispatch({ type: 'SESSION_CREATE', payload: { name: trimmed, contacts } });
    resetForm();
    onClose();
  }

  function resetForm() {
    setName('');
    setNameError('');
    setParticipantInput('');
    setParticipantError('');
    setParticipants([]);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <Modal
      title="New session"
      open={open}
      onClose={handleClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Session name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          error={nameError}
          placeholder="e.g. Weekend trip, Dinner"
          autoFocus
          maxLength={80}
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Participants</p>

          {/* You row — always shown, non-removable */}
          <div className="flex items-center gap-2 py-2 px-3 bg-indigo-50 rounded-lg mb-2">
            <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold">
              {state.settings.meName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-indigo-800">
              {state.settings.meName}{' '}
              <span className="text-indigo-500 text-xs">(you)</span>
            </span>
          </div>

          {/* Added participants */}
          {participants.length > 0 && (
            <div className="space-y-1 mb-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-800 flex-1">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(p.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                    aria-label={`Remove ${p.name}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add participant input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={participantInput}
                onChange={(e) => {
                  setParticipantInput(e.target.value);
                  setParticipantError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
                placeholder="Add person..."
                error={participantError}
                maxLength={50}
              />
            </div>
            <Button
              variant="secondary"
              onClick={handleAddParticipant}
              disabled={!participantInput.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
