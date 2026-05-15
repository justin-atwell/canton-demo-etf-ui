import type { CollateralAccount, CollateralLock, MarginCall } from '../types';

export const MOCK_ACCOUNTS: CollateralAccount[] = [
  {
    contractId: 'acc::canton::001',
    accountId: 'ACC-001',
    custodian: 'Custodian::canton-demo::001',
    owner: 'FundManager::canton-demo::001',
    asset: 'USD',
    balance: 10_000_000,
    lockedAmount: 2_500_000,
    availableAmount: 7_500_000,
    currency: 'USD',
  },
  {
    contractId: 'acc::canton::002',
    accountId: 'ACC-002',
    custodian: 'Custodian::canton-demo::001',
    owner: 'FundManager::canton-demo::001',
    asset: 'BTC',
    balance: 150,
    lockedAmount: 25,
    availableAmount: 125,
    currency: 'BTC',
  },
  {
    contractId: 'acc::canton::003',
    accountId: 'ACC-003',
    custodian: 'Custodian::canton-demo::001',
    owner: 'FundManager::canton-demo::001',
    asset: 'ETH',
    balance: 2_400,
    lockedAmount: 0,
    availableAmount: 2_400,
    currency: 'ETH',
  },
];

export const MOCK_LOCKS: CollateralLock[] = [
  {
    contractId: 'lock::canton::001',
    lockId: 'LOCK-001',
    accountId: 'ACC-001',
    amount: 1_500_000,
    reason: 'Margin requirement — CXBT rebalance',
    lockedAt: new Date(Date.now() - 3_600_000).toISOString(),
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  },
  {
    contractId: 'lock::canton::002',
    lockId: 'LOCK-002',
    accountId: 'ACC-001',
    amount: 1_000_000,
    reason: 'Basel III capital buffer',
    lockedAt: new Date(Date.now() - 7_200_000).toISOString(),
    expiresAt: null,
  },
  {
    contractId: 'lock::canton::003',
    lockId: 'LOCK-003',
    accountId: 'ACC-002',
    amount: 25,
    reason: 'Reg SHO locate requirement',
    lockedAt: new Date(Date.now() - 1_800_000).toISOString(),
    expiresAt: new Date(Date.now() + 43_200_000).toISOString(),
  },
];

export const MOCK_MARGIN_CALLS: MarginCall[] = [
  {
    contractId: 'mc::canton::001',
    callId: 'MC-001',
    accountId: 'ACC-001',
    custodian: 'Custodian::canton-demo::001',
    amount: 500_000,
    currency: 'USD',
    status: 'Pending',
    issuedAt: new Date(Date.now() - 900_000).toISOString(),
    dueAt: new Date(Date.now() + 172_800_000).toISOString(),
  },
  {
    contractId: 'mc::canton::002',
    callId: 'MC-002',
    accountId: 'ACC-002',
    custodian: 'Custodian::canton-demo::001',
    amount: 10,
    currency: 'BTC',
    status: 'Met',
    issuedAt: new Date(Date.now() - 86_400_000).toISOString(),
    dueAt: new Date(Date.now() - 43_200_000).toISOString(),
  },
];