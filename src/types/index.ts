import type { ExpenseCategory } from '../utils/categories';
export type { ExpenseCategory };

export type ParticipantId = 'me' | string;
export type SplitMode = 'equal' | 'custom';

export interface AppSettings {
  meName: string;
  currency: '$';
}

export interface SessionContact {
  contactId: string; // 'me' for the app user
  name: string;      // frozen snapshot at session creation
}

export interface ExpenseSplit {
  participantId: ParticipantId;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  payerId: ParticipantId;
  participantIds: ParticipantId[];
  splitMode: SplitMode;
  splits: ExpenseSplit[]; // always materialized
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  id: string;
  name: string;
  status: 'active' | 'archived';
  contacts: SessionContact[]; // frozen snapshot at creation
  expenses: Expense[];
  createdAt: number;
  archivedAt?: number;
}

export interface PersistedState {
  settings: AppSettings;
  sessions: Session[];
  activeSessionId: string | null;
}

// UI-only state (not persisted)
export type NavTab = 'home' | 'settings';
export type AppView =
  | { type: 'home' }
  | { type: 'session'; sessionId: string }
  | { type: 'session-summary'; sessionId: string }
  | { type: 'archived'; sessionId: string };

export interface UIState {
  activeTab: NavTab;
  view: AppView;
  expenseFormOpen: boolean;
  editingExpenseId: string | null;
}

export interface AppState extends PersistedState {
  ui: UIState;
}
