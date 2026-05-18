import { useState, useEffect, useCallback } from 'react';
import type { Role, CollateralAccount, CollateralLock, MarginCall, LockCollateralRequest, IssueMarginCallRequest } from '../types';
import { getAccounts, getLocks, getMarginCalls, lockCollateral, issueMarginCall } from '../api/collateral';
import { MOCK_ACCOUNTS, MOCK_LOCKS, MOCK_MARGIN_CALLS } from '../mocks/collateral';

const AUTH_HEADER = 'Bearer dev';

export function useCollateral(role: Role) {
  const [accounts, setAccounts] = useState<CollateralAccount[]>([]);
  const [locks, setLocks] = useState<CollateralLock[]>([]);
  const [marginCalls, setMarginCalls] = useState<MarginCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [accs, lks, mcs] = await Promise.all([
        getAccounts(AUTH_HEADER),
        getLocks(AUTH_HEADER),
        getMarginCalls(AUTH_HEADER),
      ]);
      setAccounts(accs);
      setLocks(lks);
      setMarginCalls(mcs);
      setUsingMock(false);
    } catch {
      setAccounts(MOCK_ACCOUNTS);
      setLocks(MOCK_LOCKS);
      setMarginCalls(MOCK_MARGIN_CALLS);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const lock = useCallback(async (req: LockCollateralRequest) => {
    setActionError(null);
    try {
      await lockCollateral(AUTH_HEADER, req.accountId, req);
      await load();
    } catch {
      setActionError('Lock failed — check ledger connection');
    }
  }, [load]);

  const issueCall = useCallback(async (req: IssueMarginCallRequest) => {
    setActionError(null);
    try {
      await issueMarginCall(AUTH_HEADER, req.accountId, req);
      await load();
    } catch {
      setActionError('Margin call failed — check ledger connection');
    }
  }, [load]);

  return {
    accounts,
    locks,
    marginCalls,
    loading,
    usingMock,
    actionError,
    lock,
    issueCall,
    refresh: load,
    clearError: () => setActionError(null),
  };
}