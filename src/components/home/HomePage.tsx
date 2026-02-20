import React, { useState } from 'react';
import { useAppContext } from '../../state/AppContext';
import { useActiveSession } from '../../state/hooks/useActiveSession';
import { useSettlement } from '../../state/hooks/useSettlement';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NewSessionModal } from './NewSessionModal';
import { ArchivedSessionsList } from './ArchivedSessionsList';
import { formatCurrency } from '../../utils/currency';

export function HomePage() {
  const { state, dispatch } = useAppContext();
  const activeSession = useActiveSession();
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const { balances } = useSettlement(activeSession?.id ?? '');

  const archivedSessions = state.sessions
    .filter((s) => s.status === 'archived')
    .sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0));

  const total = activeSession
    ? activeSession.expenses.reduce((sum, e) => sum + e.amount, 0)
    : 0;

  const myBalance = balances.find((b) => b.participantId === 'me')?.net ?? 0;

  return (
    <div>
      <PageHeader title="Slice" subtitle={state.settings.meName} />

      {/* Desktop stat cards row */}
      {activeSession && (
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 px-6 pt-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Expenses</p>
            <p className="text-lg font-bold text-gray-900">{activeSession.expenses.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">People</p>
            <p className="text-lg font-bold text-gray-900">{activeSession.contacts.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Your balance</p>
            <p className={`text-lg font-bold ${myBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {myBalance >= 0 ? '+' : ''}{formatCurrency(myBalance)}
            </p>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Active session card */}
        {activeSession ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{activeSession.name}</span>
                <Badge variant="green">Active</Badge>
              </div>
              <p className="text-sm text-gray-500">
                {activeSession.contacts.map((c) => c.name).join(', ')}
              </p>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {activeSession.expenses.length} expense{activeSession.expenses.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  fullWidth
                  onClick={() =>
                    dispatch({
                      type: 'NAV_GO',
                      payload: { view: { type: 'session', sessionId: activeSession.id } },
                    })
                  }
                >
                  View session
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() =>
                    dispatch({
                      type: 'NAV_GO',
                      payload: { view: { type: 'session-summary', sessionId: activeSession.id } },
                    })
                  }
                >
                  Summary
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
            <div className="text-gray-300 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">No active session</h3>
            <p className="text-sm text-gray-500 mb-4">Start a new session to split bills</p>
            <Button onClick={() => setNewSessionOpen(true)}>New session</Button>
          </div>
        )}

        {/* Start new session button when there's an active session */}
        {activeSession && (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setNewSessionOpen(true)}
          >
            + New session
          </Button>
        )}

        {/* Archived sessions */}
        <ArchivedSessionsList sessions={archivedSessions} />
      </div>

      <NewSessionModal open={newSessionOpen} onClose={() => setNewSessionOpen(false)} />
    </div>
  );
}
