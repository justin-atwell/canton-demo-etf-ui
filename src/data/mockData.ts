import type { AccessEvent, RebalanceProposal, ETF } from '../types';

export const mockAccessEvents: AccessEvent[] = [
  {
    actor: 'FundManager::abc123',
    action: 'CREATE_ETF',
    resource: 'SPY',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    granted: true,
  },
  {
    actor: 'ComplianceOfficer::def456',
    action: 'APPROVE_REBALANCE',
    resource: 'SPY-REB-001',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    granted: true,
  },
  {
    actor: 'Custodian::ghi789',
    action: 'LOCK_COLLATERAL',
    resource: 'ACC-001',
    timestamp: new Date(Date.now() - 240000).toISOString(),
    granted: true,
  },
  {
    actor: 'Auditor::jkl012',
    action: 'VIEW_CAPTABLE',
    resource: 'SPY',
    timestamp: new Date(Date.now() - 360000).toISOString(),
    granted: true,
  },
  {
    actor: 'MarketMaker::mno345',
    action: 'POST_NBBO',
    resource: 'AAPL',
    timestamp: new Date(Date.now() - 480000).toISOString(),
    granted: true,
  },
];

export const mockETFs: ETF[] = [
  {
    ticker: 'SPY',
    name: 'SPDR S&P 500',
    cusip: '78462F103',
    status: 'Active',
    navPerShare: 479.32,
    totalAUM: 4200000000,
  },
  {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    cusip: '46090E103',
    status: 'Active',
    navPerShare: 412.18,
    totalAUM: 2100000000,
  },
];

export const mockRebalanceProposals: RebalanceProposal[] = [
  {
    proposalId: 'REB-001',
    ticker: 'SPY',
    status: 'Pending',
    newWeights: [
      { symbol: 'AAPL', weight: 0.07 },
      { symbol: 'MSFT', weight: 0.065 },
      { symbol: 'NVDA', weight: 0.06 },
    ],
    proposedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    proposalId: 'REB-002',
    ticker: 'QQQ',
    status: 'Approved',
    newWeights: [
      { symbol: 'AAPL', weight: 0.12 },
      { symbol: 'MSFT', weight: 0.10 },
    ],
    proposedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const mockNBBOQuotes: { symbol: string; bid: number; ask: number; time: string }[] = [
  { symbol: 'AAPL', bid: 189.42, ask: 189.45, time: new Date().toISOString() },
  { symbol: 'MSFT', bid: 412.18, ask: 412.22, time: new Date().toISOString() },
  { symbol: 'NVDA', bid: 876.54, ask: 876.61, time: new Date().toISOString() },
  { symbol: 'GOOGL', bid: 175.23, ask: 175.27, time: new Date().toISOString() },
  { symbol: 'AMZN', bid: 192.87, ask: 192.91, time: new Date().toISOString() },
];