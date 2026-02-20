import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState } from '../types';
import type { Action } from './actions';
import { reducer, initState } from './reducer';
import { persistState, extractPersistedState } from './persistence';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Persist on every state change (debounced 300ms)
  useEffect(() => {
    persistState(extractPersistedState(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
