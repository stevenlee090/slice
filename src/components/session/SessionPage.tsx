import { useState } from 'react';
import { useAppContext } from '../../state/AppContext';
import { useSessionContacts } from '../../state/hooks/useSessionContacts';
import { PageHeader } from '../layout/PageHeader';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ExpenseList } from './expenses/ExpenseList';
import { ExpenseForm } from './expenses/ExpenseForm';
import { formatCurrency } from '../../utils/currency';
import type { Expense } from '../../types';

interface SessionPageProps {
  sessionId: string;
}

export function SessionPage({ sessionId }: SessionPageProps) {
  const { state, dispatch } = useAppContext();
  const contacts = useSessionContacts(sessionId);
  const session = state.sessions.find((s) => s.id === sessionId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);

  if (!session) return null;

  const total = session.expenses.reduce((sum, e) => sum + e.amount, 0);
  const isActive = session.status === 'active';

  const editingExpense = editingExpenseId
    ? session.expenses.find((e) => e.id === editingExpenseId)
    : null;

  function handleAddExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    dispatch({ type: 'EXPENSE_ADD', payload: { sessionId, expense: data } });
  }

  function handleUpdateExpense(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editingExpenseId) return;
    dispatch({
      type: 'EXPENSE_UPDATE',
      payload: { sessionId, expenseId: editingExpenseId, updates: data },
    });
  }

  function handleDeleteExpense(expenseId: string) {
    dispatch({ type: 'EXPENSE_DELETE', payload: { sessionId, expenseId } });
  }

  function handleArchive() {
    dispatch({ type: 'SESSION_ARCHIVE_CURRENT' });
  }

  return (
    <div>
      <PageHeader
        title={session.name}
        subtitle={session.contacts.map((c) => c.name).join(', ')}
        backAction={{
          label: 'Home',
          onClick: () => dispatch({ type: 'NAV_GO', payload: { view: { type: 'home' } } }),
        }}
        actions={
          <div className="flex items-center gap-2">
            {isActive && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  dispatch({
                    type: 'NAV_GO',
                    payload: { view: { type: 'session-summary', sessionId } },
                  })
                }
              >
                Summary
              </Button>
            )}
            {isActive && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setArchiveConfirmOpen(true)}
              >
                Archive
              </Button>
            )}
          </div>
        }
      />

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Expenses</p>
          <p className="text-lg font-bold text-gray-900">{session.expenses.length}</p>
        </div>
        {!isActive && <Badge variant="gray">Archived</Badge>}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Expenses</h2>
          {isActive && session.expenses.length > 0 && (
            <Button size="sm" onClick={() => setFormOpen(true)}>
              + Add
            </Button>
          )}
        </div>

        <ExpenseList
          expenses={session.expenses}
          contacts={contacts}
          onEdit={(id) => {
            setEditingExpenseId(id);
            setFormOpen(true);
          }}
          onDelete={handleDeleteExpense}
          onAdd={() => setFormOpen(true)}
        />
      </div>

      {/* Expense Form */}
      <ExpenseForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingExpenseId(null);
        }}
        contacts={contacts}
        title={editingExpenseId ? 'Edit expense' : 'Add expense'}
        initialValues={
          editingExpense
            ? {
                description: editingExpense.description,
                amount: editingExpense.amount,
                category: editingExpense.category,
                payerId: editingExpense.payerId,
                participantIds: editingExpense.participantIds,
                splitMode: editingExpense.splitMode,
                splits: editingExpense.splits,
              }
            : undefined
        }
        onSave={(data) => {
          if (editingExpenseId) {
            handleUpdateExpense(data);
          } else {
            handleAddExpense(data);
          }
          setEditingExpenseId(null);
        }}
      />

      {/* Archive confirm */}
      <ConfirmDialog
        open={archiveConfirmOpen}
        title="Archive session"
        message={`Archive "${session.name}"? You won't be able to add expenses to it, but you can view the history.`}
        confirmLabel="Archive"
        variant="primary"
        onConfirm={() => {
          handleArchive();
          setArchiveConfirmOpen(false);
        }}
        onCancel={() => setArchiveConfirmOpen(false)}
      />
    </div>
  );
}
