import type { Role } from '../../types';
import { 
  LayoutDashboard, 
  TrendingUp, 
  RefreshCw, 
  Shield, 
  FileText,
  Activity,
  ChevronRight
} from 'lucide-react';
import { navItems } from '../../config/navigation';
interface SidebarProps {
  currentRole: Role;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentRole, activePage, onNavigate }: SidebarProps) {
  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="w-64 h-screen bg-canton-darker border-r border-canton-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-canton-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-canton-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <p className="text-canton-text font-semibold text-sm">Canton ETF</p>
            <p className="text-canton-muted text-xs">Platform</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive 
                  ? 'bg-canton-accent text-white' 
                  : 'text-canton-muted hover:text-canton-text hover:bg-canton-card'
              }`}
            >
              <Icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>

      {/* Canton Network badge */}
      <div className="p-4 border-t border-canton-border">
        <div className="flex items-center gap-2 px-3 py-2 bg-canton-card rounded-lg">
          <div className="w-2 h-2 bg-canton-green rounded-full animate-pulse" />
          <span className="text-canton-muted text-xs">Connected to DevNet</span>
        </div>
      </div>
    </div>
  );
}