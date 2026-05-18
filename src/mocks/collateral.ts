import type { CollateralAccount, CollateralLock, MarginCall } from '../types';

export const MOCK_ACCOUNTS: CollateralAccount[] = [
  {
    contractId: 'acc::canton::001',
    accountId: 'ACC-001',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    compliance: 'ComplianceOfficer::canton-demo::001',
    auditor: 'Auditor::canton-demo::001',
    asset: 'USD',
    balance: 10_000_000,
  },
  {
    contractId: 'acc::canton::002',
    accountId: 'ACC-002',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    compliance: 'ComplianceOfficer::canton-demo::001',
    auditor: 'Auditor::canton-demo::001',
    asset: 'BTC',
    balance: 150,
  },
  {
    contractId: 'acc::canton::003',
    accountId: 'ACC-003',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    compliance: 'ComplianceOfficer::canton-demo::001',
    auditor: 'Auditor::canton-demo::001',
    asset: 'ETH',
    balance: 2_400,
  },
];

export const MOCK_LOCKS: CollateralLock[] = [
  {
    contractId: 'lock::canton::001',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    asset: 'USD',
    amount: 1_500_000,
    reason: 'Margin requirement — CXBT rebalance',
    lockedAt: new Date(Date.now() - 3_600_000).toISOString(),
    expiry: new Date(Date.now() + 86_400_000).toISOString(),
  },
  {
    contractId: 'lock::canton::002',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    asset: 'USD',
    amount: 1_000_000,
    reason: 'Basel III capital buffer',
    lockedAt: new Date(Date.now() - 7_200_000).toISOString(),
    expiry: new Date(Date.now() + 31_536_000_000).toISOString(), // ~1 year
  },
  {
    contractId: 'lock::canton::003',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    asset: 'BTC',
    amount: 25,
    reason: 'Reg SHO locate requirement',
    lockedAt: new Date(Date.now() - 1_800_000).toISOString(),
    expiry: new Date(Date.now() + 43_200_000).toISOString(),
  },
];

export const MOCK_MARGIN_CALLS: MarginCall[] = [
  {
    contractId: 'mc::canton::001',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    compliance: 'ComplianceOfficer::canton-demo::001',
    auditor: 'Auditor::canton-demo::001',
    asset: 'USD',
    amountRequired: 500_000,
    status: 'Pending',
    issuedAt: new Date(Date.now() - 900_000).toISOString(),
    dueBy: new Date(Date.now() + 172_800_000).toISOString(),
  },
  {
    contractId: 'mc::canton::002',
    custodian: 'Custodian::canton-demo::001',
    fundManager: 'FundManager::canton-demo::001',
    compliance: 'ComplianceOfficer::canton-demo::001',
    auditor: 'Auditor::canton-demo::001',
    asset: 'BTC',
    amountRequired: 10,
    status: 'Met',
    issuedAt: new Date(Date.now() - 86_400_000).toISOString(),
    dueBy: new Date(Date.now() - 43_200_000).toISOString(),
  },
];
