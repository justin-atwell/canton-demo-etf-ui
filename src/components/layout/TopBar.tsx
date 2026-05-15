import type { Role, User } from '../../types';

interface TopBarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const roles: { role: Role; label: string; color: string }[] = [
  { role: 'FundManager', label: 'Fund Manager', color: 'bg-blue-500' },
  { role: 'ComplianceOfficer', label: 'Compliance', color: 'bg-yellow-500' },
  { role: 'Custodian', label: 'Custodian', color: 'bg-purple-500' },
  { role: 'Auditor', label: 'Auditor', color: 'bg-green-500' },
  { role: 'MarketMaker', label: 'Market Maker', color: 'bg-orange-500' },
];

export default function TopBar({ currentRole, onRoleChange }: TopBarProps) {

  return (
    <div className="h-16 bg-canton-darker border-b border-canton-border flex items-center justify-between px-6">
      {/* Left - page context */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-canton-green rounded-full animate-pulse" />
        <span className="text-canton-muted text-sm">Live on Canton DevNet</span>
      </div>

      {/* Right - role switcher */}
      <div className="flex items-center gap-3">
        <span className="text-canton-muted text-sm">Viewing as:</span>
        <div className="flex items-center gap-2 bg-canton-card border border-canton-border rounded-lg p-1">
          {roles.map(({ role, label, color }) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentRole === role
                  ? 'bg-canton-border text-canton-text'
                  : 'text-canton-muted hover:text-canton-text'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}