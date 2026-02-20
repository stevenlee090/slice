import { useState } from 'react';
import { useAppContext } from '../../state/AppContext';
import { PageHeader } from '../layout/PageHeader';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function SettingsPage() {
  const { state, dispatch } = useAppContext();
  const [meName, setMeName] = useState(state.settings.meName);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const trimmed = meName.trim();
    if (!trimmed) return;
    dispatch({ type: 'SETTINGS_UPDATE', payload: { meName: trimmed } });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="p-4 space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Your Profile</h2>
          <Input
            label="Your name"
            value={meName}
            onChange={(e) => {
              setMeName(e.target.value);
              setSaved(false);
            }}
            placeholder="Enter your name"
            maxLength={50}
          />
          <Button
            onClick={handleSave}
            disabled={!meName.trim() || meName.trim() === state.settings.meName}
          >
            {saved ? 'Saved!' : 'Save changes'}
          </Button>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">About</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Slice — local-first, no account needed.</p>
            <p className="text-xs text-gray-400">All data stored in your browser's localStorage.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
