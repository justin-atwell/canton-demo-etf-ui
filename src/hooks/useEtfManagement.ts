import { useState, useEffect, useCallback } from 'react';
import type { Role, EtfDetail, NavDataPoint } from '../types';
import { getEtf, getNavHistory, proposeRebalance } from '../api/etf';
import { MOCK_ETF_DETAIL, MOCK_NAV_HISTORY } from '../mocks/etfDetail';

const PARTY_IDS: Record<Role, string> = {
  FundManager:       'FundManager::canton-demo::001',
  ComplianceOfficer: 'ComplianceOfficer::canton-demo::001',
  Custodian:         'Custodian::canton-demo::001',
  Auditor:           'Auditor::canton-demo::001',
  MarketMaker:       'MarketMaker::canton-demo::001',
};

export function useEtfManagement(ticker: string, role: Role) {
  const [etf, setEtf] = useState<EtfDetail | null>(null);
  const [navHistory, setNavHistory] = useState<NavDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalId, setProposalId] = useState<string | null>(null);

  const partyId = PARTY_IDS[role];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [etfData, navData] = await Promise.all([
        getEtf(ticker, partyId),
        getNavHistory(ticker, partyId),
      ]);
      setEtf(etfData);
      setNavHistory(navData);
    } catch {
      // Java stubs not yet wired — fall back to mock
      setEtf(MOCK_ETF_DETAIL);
      setNavHistory(MOCK_NAV_HISTORY);
    } finally {
      setLoading(false);
    }
  }, [ticker, partyId]);

  useEffect(() => { load(); }, [load]);

  const propose = useCallback(async (newWeights: Record<string, number>) => {
    try {
      const res = await proposeRebalance(ticker, { partyId, newWeights });
      setProposalId(res.proposalId);
    } catch {
      // Stub not implemented — surface a local ID so the UI flow works
      setProposalId(`PROP-${Date.now()}`);
    }
  }, [ticker, partyId]);

  return {
    etf,
    navHistory,
    loading,
    proposalId,
    propose,
    refresh: load,
    clearProposal: () => setProposalId(null),
  };
}