import type { AppState, Session, UIState } from '../types';
import type { Action } from './actions';
import { loadState } from './persistence';
import { generateId } from '../utils/uuid';

const DEFAULT_UI: UIState = {
  activeTab: 'home',
  view: { type: 'home' },
  expenseFormOpen: false,
  editingExpenseId: null,
};

export function initState(): AppState {
  const persisted = loadState();
  return {
    ...persisted,
    ui: DEFAULT_UI,
  };
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // ── Settings ────────────────────────────────────────────────────────────
    case 'SETTINGS_UPDATE':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    // ── Sessions ────────────────────────────────────────────────────────────
    case 'SESSION_CREATE': {
      const { name, contacts } = action.payload;

      const newSession: Session = {
        id: generateId(),
        name: name.trim(),
        status: 'active',
        contacts,
        expenses: [],
        createdAt: Date.now(),
      };

      return {
        ...state,
        sessions: [...state.sessions, newSession],
        activeSessionId: newSession.id,
        ui: { ...state.ui, view: { type: 'session', sessionId: newSession.id }, activeTab: 'home' },
      };
    }

    case 'SESSION_ARCHIVE_CURRENT': {
      if (!state.activeSessionId) return state;
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === state.activeSessionId
            ? { ...s, status: 'archived', archivedAt: Date.now() }
            : s
        ),
        activeSessionId: null,
        ui: { ...state.ui, view: { type: 'home' }, activeTab: 'home' },
      };
    }

    case 'SESSION_START_NEW':
      return {
        ...state,
        activeSessionId: null,
        ui: { ...state.ui, view: { type: 'home' }, activeTab: 'home' },
      };

    case 'SESSION_DELETE':
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.payload.id),
        activeSessionId:
          state.activeSessionId === action.payload.id
            ? null
            : state.activeSessionId,
      };

    // ── Expenses ────────────────────────────────────────────────────────────
    case 'EXPENSE_ADD': {
      const { sessionId, expense } = action.payload;
      const newExpense = {
        ...expense,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === sessionId
            ? { ...s, expenses: [...s.expenses, newExpense] }
            : s
        ),
      };
    }

    case 'EXPENSE_UPDATE': {
      const { sessionId, expenseId, updates } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                expenses: s.expenses.map((e) =>
                  e.id === expenseId
                    ? { ...e, ...updates, updatedAt: Date.now() }
                    : e
                ),
              }
            : s
        ),
      };
    }

    case 'EXPENSE_DELETE': {
      const { sessionId, expenseId } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === sessionId
            ? { ...s, expenses: s.expenses.filter((e) => e.id !== expenseId) }
            : s
        ),
      };
    }

    // ── Navigation (UI-only) ─────────────────────────────────────────────────
    case 'NAV_GO':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...(action.payload.tab !== undefined ? { activeTab: action.payload.tab } : {}),
          ...(action.payload.view !== undefined ? { view: action.payload.view } : {}),
        },
      };

    case 'EXPENSE_FORM_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          expenseFormOpen: true,
          editingExpenseId: action.payload.editingExpenseId ?? null,
        },
      };

    case 'EXPENSE_FORM_CLOSE':
      return {
        ...state,
        ui: { ...state.ui, expenseFormOpen: false, editingExpenseId: null },
      };

    default:
      return state;
  }
}
