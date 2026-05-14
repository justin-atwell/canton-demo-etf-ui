import { useState } from 'react';
import type { Role } from '../../types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [currentRole, setCurrentRole] = useState<Role>('FundManager');

  return (
    <div className="flex h-screen bg-canton-dark overflow-hidden">
      <Sidebar 
        currentRole={currentRole}
        activePage={activePage}
        onNavigate={onNavigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}