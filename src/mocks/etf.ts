import type { EtfDetail, NavDataPoint } from '../types/etf';

export const MOCK_ETF: EtfDetail = {
  contractId: '00canton::etf::CXBT::001',
  ticker: 'CXBT',
  name: 'Canton Digital Asset ETF',
  cusip: '14314X100',
  status: 'Active',
  fundManager: 'FundManager::canton-demo::001',
  inceptionDate: '2025-01-15',
  navPerShare: 84.72,
  totalAUM: 847_230_000,
  constituents: [
    { contractId: 'c1', ticker: 'BTC', name: 'Bitcoin',    cusip: 'BTC-SPOT', targetWeight: 45.0, currentWeight: 46.2, lastPrice: 64_230, priceChange24h:  2.31 },
    { contractId: 'c2', ticker: 'ETH', name: 'Ethereum',   cusip: 'ETH-SPOT', targetWeight: 25.0, currentWeight: 24.1, lastPrice:  3_480, priceChange24h: -0.87 },
    { contractId: 'c3', ticker: 'SOL', name: 'Solana',     cusip: 'SOL-SPOT', targetWeight: 15.0, currentWeight: 15.8, lastPrice:    158, priceChange24h:  4.12 },
    { contractId: 'c4', ticker: 'AVAX', name: 'Avalanche', cusip: 'AVAX-SPOT',targetWeight: 10.0, currentWeight:  9.7, lastPrice:   38.4, priceChange24h: -1.23 },
    { contractId: 'c5', ticker: 'LINK', name: 'Chainlink', cusip: 'LINK-SPOT',targetWeight:  5.0, currentWeight:  4.2, lastPrice:   14.8, priceChange24h:  0.64 },
  ],
};

export const MOCK_NAV: NavDataPoint[] = Array.from({ length: 60 }, (_, i) => {
  const d = new Date('2025-03-01');
  d.setDate(d.getDate() + i);
  return {
  contractId: `nav::mock::${i}`,
  ticker: 'CXBT',
  date: d.toISOString().split('T')[0],   // add this
  navDate: d.toISOString().split('T')[0],
  navPerShare: parseFloat((72 + i * 0.21 + Math.sin(i * 0.4) * 1.8).toFixed(2)),
  totalAUM: Math.round((72 + i * 0.21) * 10_000_000),
  source: 'mock',
  fundManager: 'FundManager::canton-demo::001',
};
});