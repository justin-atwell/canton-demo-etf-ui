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

// Extended ETF detail — includes ledger fields not in the list view type
export interface EtfDetail extends ETF {
  contractId: string;
  fundManager: string;
  inceptionDate: string;
  constituents: ConstituentDetail[];
}

export interface ConstituentDetail {
  contractId: string;
  ticker: string;
  name: string;
  cusip: string;
  targetWeight: number;   // what the fund mandate says
  currentWeight: number;  // what it actually is right now
  lastPrice: number;
  priceChange24h: number;
}

export interface NavDataPoint {
  date: string;
  navPerShare: number;
  totalAUM: number;
}

export interface ProposeRebalanceRequest {
  partyId: string;
  newWeights: Record<string, number>; // contractId → target weight %
}

export interface ProposeRebalanceResponse {
  proposalId: string;
}

export interface CollateralAccount {
  contractId: string;
  accountId: string;
  custodian: string;
  owner: string;
  asset: string;
  balance: number;
  lockedAmount: number;
  availableAmount: number;
  currency: string;
}

export interface CollateralLock {
  contractId: string;
  lockId: string;
  accountId: string;
  amount: number;
  reason: string;
  lockedAt: string;
  expiresAt: string | null;
}

export interface MarginCall {
  contractId: string;
  callId: string;
  accountId: string;
  custodian: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Met' | 'Defaulted';
  issuedAt: string;
  dueAt: string;
}

export interface CreateCollateralAccountRequest {
  partyId: string;
  owner: string;
  asset: string;
  initialBalance: number;
  currency: string;
}

export interface LockCollateralRequest {
  partyId: string;
  accountId: string;
  amount: number;
  reason: string;
  expiresAt: string | null;
}

export interface IssueMarginCallRequest {
  partyId: string;
  accountId: string;
  amount: number;
  currency: string;
  dueAt: string;
}