// -------------------------------------------------------------------------
// Auth / Roles
// -------------------------------------------------------------------------

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

// -------------------------------------------------------------------------
// ETF
// -------------------------------------------------------------------------

export interface ETF {
  ticker: string;
  name: string;
  cusip: string;
  status: 'Active' | 'Suspended' | 'Terminated';
  navPerShare: number;
  totalAUM: number;
}

// Extended ETF detail — includes ledger fields not in the list view type
export interface EtfDetail {
  contractId: string;
  ticker: string;
  name: string;
  cusip: string;
  status: 'Active' | 'Suspended' | 'Terminated';
  fundManager: string;
  custodian: string;
  compliance: string;
  auditor: string;
  inceptionDate: string;  // LocalDate serializes as ISO string "2024-01-15"
}

export interface CreateEtfRequest {
  ticker: string;
  name: string;
  cusip: string;
  custodian: string;
  compliance: string;
  auditor: string;
}

// -------------------------------------------------------------------------
// NAV
// -------------------------------------------------------------------------

export interface NavDataPoint {
  contractId: string;
  ticker: string;
  navDate: string;        // LocalDate → "2024-01-15"
  navPerShare: number;
  totalAUM: number;
  source: string;
  fundManager: string;
}

export interface CreateNAVRequest {
  navDate: string;        // "2024-01-15"
  navPerShare: number;
  totalAUM: number;
  source: string;
}

// -------------------------------------------------------------------------
// Rebalance
// -------------------------------------------------------------------------

export interface WeightEntry {
  symbol: string;
  weight: number;
}

export interface RebalanceProposal {
  contractId: string;
  proposalId: string;
  ticker: string;
  fundManager: string;
  complianceOfficer: string;
  newWeights: WeightEntry[];  // List<Tuple2> serializes as [{_1: symbol, _2: weight}]
  proposedAt: string;         // Instant → ISO string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Executed';
}

export interface ProposeRebalanceRequest {
  proposalId: string;
  newWeights: WeightEntry[];
}

// -------------------------------------------------------------------------
// Collateral
// -------------------------------------------------------------------------

export interface CollateralAccount {
  contractId: string;
  accountId: string;
  custodian: string;
  fundManager: string;
  compliance: string;
  auditor: string;
  asset: string;
  balance: number;
}

export interface CollateralLock {
  contractId: string;
  custodian: string;
  fundManager: string;
  asset: string;
  amount: number;
  reason: string;
  expiry: string;     // Instant → ISO string
  lockedAt: string;   // Instant → ISO string
}

export interface MarginCall {
  contractId: string;
  custodian: string;
  fundManager: string;
  compliance: string;
  auditor: string;
  asset: string;
  amountRequired: number;
  issuedAt: string;   // Instant → ISO string
  dueBy: string;      // Instant → ISO string
  status: 'Pending' | 'Met' | 'Defaulted';
}

export interface CreateCollateralAccountRequest {
  accountId: string;
  custodian: string;
  fundManager: string;
  compliance: string;
  auditor: string;
  asset: string;
  initialBalance: number;
}

export interface CollateralTransactionRequest {
  amount: number;
}

export interface LockCollateralRequest {
  accountId: string;
  amount: number;
  reason: string;
  expiry: string;     // ISO instant string e.g. "2024-12-31T00:00:00Z"
}

export interface IssueMarginCallRequest {
  accountId: string;
  asset: string;
  amountRequired: number;
  dueBy: string;      // ISO instant string
}

// -------------------------------------------------------------------------
// Audit
// -------------------------------------------------------------------------

export interface AccessEvent {
  contractId: string;
  operator: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;  // Instant → ISO string
  granted: boolean;
  clientIp: string;
  sessionId: string;
}

// -------------------------------------------------------------------------
// Compliance
// -------------------------------------------------------------------------

export interface ComplianceBadge {
  regulation: string;
  requirement: string;
  satisfied: boolean;
}

// -------------------------------------------------------------------------
// NBBO
// -------------------------------------------------------------------------

export interface NBBOQuote {
  contractId: string;
  symbol: string;
  bidPrice: number;
  askPrice: number;
  bidSize: number;
  askSize: number;
  timestamp: string;  // Instant → ISO string
  marketMaker: string;
}