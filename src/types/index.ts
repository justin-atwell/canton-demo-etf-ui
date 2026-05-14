export type Role = 
  | 'FundManager' 
  | 'ComplianceOfficer' 
  | 'Custodian' 
  | 'Auditor' 
  | 'MarketMaker';

export interface User {
  role: Role;
  partyId: string;
  email: string;
}

export interface ETF {
  ticker: string;
  name: string;
  cusip: string;
  status: 'Active' | 'Suspended' | 'Terminated';
  navPerShare: number;
  totalAUM: number;
}

export interface Constituent {
  symbol: string;
  name: string;
  weight: number;
  cusip: string;
}

export interface RebalanceProposal {
  proposalId: string;
  ticker: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Executed';
  newWeights: { symbol: string; weight: number }[];
  proposedAt: string;
}

export interface AccessEvent {
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  granted: boolean;
}

export interface ComplianceBadge {
  regulation: string;
  requirement: string;
  satisfied: boolean;
}