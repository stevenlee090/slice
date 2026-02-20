import type { AppSettings, SessionContact, Expense, NavTab, AppView } from '../types';

export type Action =
  // Settings
  | { type: 'SETTINGS_UPDATE'; payload: Partial<AppSettings> }

  // Sessions
  | { type: 'SESSION_CREATE'; payload: { name: string; contacts: SessionContact[] } }
  | { type: 'SESSION_ARCHIVE_CURRENT' }
  | { type: 'SESSION_START_NEW' }
  | { type: 'SESSION_DELETE'; payload: { id: string } }

  // Expenses
  | { type: 'EXPENSE_ADD'; payload: { sessionId: string; expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> } }
  | { type: 'EXPENSE_UPDATE'; payload: { sessionId: string; expenseId: string; updates: Partial<Omit<Expense, 'id' | 'createdAt'>> } }
  | { type: 'EXPENSE_DELETE'; payload: { sessionId: string; expenseId: string } }

  // Navigation (UI-only, not persisted)
  | { type: 'NAV_GO'; payload: { tab?: NavTab; view?: AppView } }
  | { type: 'EXPENSE_FORM_OPEN'; payload: { editingExpenseId?: string } }
  | { type: 'EXPENSE_FORM_CLOSE' };
