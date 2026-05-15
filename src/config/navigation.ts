import type { ComponentType } from 'react';
import type { Role } from '../types';
import {
  LayoutDashboard, TrendingUp, RefreshCw,
  Shield, FileText, Activity
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  roles: Role[];
}

export const navItems: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',      icon: LayoutDashboard, roles: ['FundManager', 'ComplianceOfficer', 'Custodian', 'Auditor', 'MarketMaker'] },
  { id: 'etf',        label: 'ETF Management', icon: TrendingUp,       roles: ['FundManager', 'ComplianceOfficer', 'Auditor'] },
  { id: 'rebalance',  label: 'Rebalancing',    icon: RefreshCw,        roles: ['FundManager', 'ComplianceOfficer', 'Auditor'] },
  { id: 'collateral', label: 'Collateral',     icon: Shield,           roles: ['Custodian', 'FundManager', 'Auditor'] },
  { id: 'audit',      label: 'Audit Trail',    icon: Activity,         roles: ['Auditor', 'ComplianceOfficer'] },
  { id: 'compliance', label: 'Compliance',     icon: FileText,         roles: ['FundManager', 'ComplianceOfficer', 'Custodian', 'Auditor', 'MarketMaker'] },
];