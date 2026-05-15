import { useState, useEffect, useCallback } from 'react';
import type { Role, CollateralAccount, CollateralLock, MarginCall, LockCollateralRequest, IssueMarginCallRequest } from '../types';
import { getAccounts, getLocks, getMarginCalls, lockCollateral, issueMarginCall } from '../api/collateral';
import { MOCK_ACCOUNTS, MOCK_LOCKS, MOCK_MARGIN_CALLS } from '../mocks/collateral';

const PARTY_IDS: Record<Role, string> = {
  FundManager:       'FundManager::canton-demo::001',
  ComplianceOfficer: 'ComplianceOfficer::canton-demo::001',
  Custodian:         'Custodian::canton-demo::001',
  Auditor:           'Auditor::canton-demo::001',
  MarketMaker:       'MarketMaker::canton-demo::001',
};

export function useCollateral(role: Role) {
  const [accounts, setAccounts] = useState<CollateralAccount[]>([]);
  const [locks, setLocks] = useState<CollateralLock[]>([]);
  const [marginCalls, setMarginCalls] = useState<MarginCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const partyId = PARTY_IDS[role];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [accs, lks, mcs] = await Promise.all([
        getAccounts(partyId),
        getLocks(partyId),
        getMarginCalls(partyId),
      ]);
      setAccounts(accs);
      setLocks(lks);
      setMarginCalls(mcs);
    } catch {
      setAccounts(MOCK_ACCOUNTS);
      setLocks(MOCK_LOCKS);
      setMarginCalls(MOCK_MARGIN_CALLS);
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  useEffect(() => { load(); }, [load]);

  const lock = useCallback(async (req: Omit<LockCollateralRequest, 'partyId'>) => {
    setActionError(null);
    try {
      const newLock = await lockCollateral({ ...req, partyId });
      setLocks(prev => [newLock, ...prev]);
    } catch {
      setActionError('Lock failed — Java stub not yet implemented');
    }
  }, [partyId]);

  const issueCall = useCallback(async (req: Omit<IssueMarginCallRequest, 'partyId'>) => {
    setActionError(null);
    try {
      const newCall = await issueMarginCall({ ...req, partyId });
      setMarginCalls(prev => [newCall, ...prev]);
    } catch {
      setActionError('Margin call failed — Java stub not yet implemented');
    }
  }, [partyId]);

  return {
    accounts,
    locks,
    marginCalls,
    loading,
    actionError,
    lock,
    issueCall,
    refresh: load,
    clearError: () => setActionError(null),
  };
}