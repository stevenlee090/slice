import { NavBar } from './NavBar';
import { SideNav } from './SideNav';
import { RightPanel } from '../session/RightPanel';
import { useAppContext } from '../../state/AppContext';
import { HomePage } from '../home/HomePage';
import { SettingsPage } from '../settings/SettingsPage';
import { SessionPage } from '../session/SessionPage';
import { SummaryPage } from '../session/summary/SummaryPage';
import { ArchivedSessionPage } from '../archived/ArchivedSessionPage';
import type { AppView } from '../../types';

function getRightPanelSessionId(view: AppView): string | null {
  if (view.type === 'session') return view.sessionId;
  if (view.type === 'session-summary') return view.sessionId;
  if (view.type === 'archived') return view.sessionId;
  return null;
}

export function AppShell() {
  const { state } = useAppContext();
  const { ui } = state;

  function renderContent() {
    // Non-home tabs always override
    if (ui.activeTab === 'settings') return <SettingsPage />;

    // Home tab: route by view
    switch (ui.view.type) {
      case 'session':
        return <SessionPage sessionId={ui.view.sessionId} />;
      case 'session-summary':
        return <SummaryPage sessionId={ui.view.sessionId} />;
      case 'archived':
        return <ArchivedSessionPage sessionId={ui.view.sessionId} />;
      default:
        return <HomePage />;
    }
  }

  const sessionId = ui.activeTab !== 'settings' ? getRightPanelSessionId(ui.view) : null;

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <SideNav />
      <div className="flex-1 lg:ml-56 lg:flex min-w-0">
        <main className="max-w-lg mx-auto lg:max-w-none flex-1 min-w-0 pb-20 lg:pb-6">
          {renderContent()}
        </main>
        {sessionId && <RightPanel sessionId={sessionId} />}
      </div>
      <NavBar />
    </div>
  );
}
