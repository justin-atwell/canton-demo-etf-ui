import { useState } from 'react';
import type { Role } from '../../types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  onRoleChange: (role: Role) => void;
  currentRole: Role
}

export default function Layout({ children, activePage, onNavigate, currentRole, onRoleChange }: LayoutProps) {
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
          onRoleChange={onRoleChange}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}