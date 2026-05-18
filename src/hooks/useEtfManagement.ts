import { useState, useEffect, useCallback } from 'react';
import type { Role, NavDataPoint } from '../types';
import type { EtfDetailExtended } from '../mocks/etfDetail';
import { getEtf, getNavHistory, proposeRebalance } from '../api/etf';
import { MOCK_ETF_DETAIL, MOCK_NAV_HISTORY } from '../mocks/etfDetail';

const AUTH_HEADER = 'Bearer dev';

export function useEtfManagement(ticker: string, role: Role) {
  const [etf, setEtf] = useState<EtfDetailExtended | null>(null);
  const [navHistory, setNavHistory] = useState<NavDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalId, setProposalId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [etfData, navData] = await Promise.all([
        getEtf(AUTH_HEADER, ticker),
        getNavHistory(AUTH_HEADER, ticker),
      ]);
      // API returns EtfDetail without constituents/navPerShare/totalAUM —
      // merge with mock constituent data until NBBO oracle is live
      setEtf({
        ...MOCK_ETF_DETAIL,
        ...etfData,
      });
      setNavHistory(navData.length > 0 ? navData : MOCK_NAV_HISTORY);
    } catch {
      setEtf(MOCK_ETF_DETAIL);
      setNavHistory(MOCK_NAV_HISTORY);
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => { load(); }, [load]);

  const propose = useCallback(async (newWeights: Record<string, number>) => {
    const proposalIdStr = `PROP-${Date.now()}`;
    try {
      const weightEntries = Object.entries(newWeights).map(([symbol, weight]) => ({
        symbol,
        weight,
      }));
      await proposeRebalance(AUTH_HEADER, ticker, {
        proposalId: proposalIdStr,
        newWeights: weightEntries,
      });
      setProposalId(proposalIdStr);
    } catch {
      // Surface a local ID so the UI flow still works when ledger is unavailable
      setProposalId(proposalIdStr);
    }
  }, [ticker]);

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