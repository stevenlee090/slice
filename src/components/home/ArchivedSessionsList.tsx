import React, { useState } from 'react';
import type { Session } from '../../types';
import { useAppContext } from '../../state/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatCurrency } from '../../utils/currency';

interface ArchivedSessionsListProps {
  sessions: Session[];
}

function sessionTotal(session: Session): number {
  return session.expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function ArchivedSessionsList({ sessions }: ArchivedSessionsListProps) {
  const { dispatch } = useAppContext();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (sessions.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
        Archived
      </h2>
      <div className="space-y-2 px-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() =>
                  dispatch({
                    type: 'NAV_GO',
                    payload: { view: { type: 'archived', sessionId: session.id } },
                  })
                }
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 truncate">{session.name}</span>
                  <Badge variant="gray">Archived</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {session.expenses.length} expense{session.expenses.length !== 1 ? 's' : ''} ·{' '}
                  {formatCurrency(sessionTotal(session))}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(session.id)}
                className="ml-2 shrink-0"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete session"
        message="This will permanently delete the session and all its expenses. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            dispatch({ type: 'SESSION_DELETE', payload: { id: deleteTarget } });
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
