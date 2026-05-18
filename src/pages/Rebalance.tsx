import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Play, RefreshCw } from 'lucide-react';
import type { RebalanceProposal, Role } from '../types';
import { mockRebalanceProposals } from '../data/mockData';
import { getProposal, approveProposal, rejectProposal, getProposals, executeProposal } from '../api/etf';

const AUTH_HEADER = 'Bearer dev';

const statusConfig = {
  Pending:  { color: 'text-canton-yellow', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  Approved: { color: 'text-canton-green',  bg: 'bg-green-500/10 border-green-500/20',   icon: CheckCircle },
  Rejected: { color: 'text-canton-red',    bg: 'bg-red-500/10 border-red-500/20',        icon: XCircle },
  Executed: { color: 'text-canton-accent', bg: 'bg-blue-500/10 border-blue-500/20',      icon: Play },
};

const regulationMap: Record<string, string> = {
  Pending:  'SEC 38a-1 — Awaiting Compliance Approval',
  Approved: 'SEC 38a-1 ✓ — Compliance Approved',
  Rejected: 'SEC 38a-1 — Compliance Rejected',
  Executed: 'SEC 22c-1 ✓ — Executed at NAV',
};

interface RebalanceProps {
  currentRole: Role;
}

export default function Rebalance({ currentRole }: RebalanceProps) {
  const [proposals, setProposals] = useState<RebalanceProposal[]>([]);
  const [selected, setSelected] = useState<RebalanceProposal | null>(null);
  const [usingMock, setUsingMock] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
  const load = async () => {
    try {
      const data = await getProposals(AUTH_HEADER, 'CXBT');
      setProposals(data.length > 0 ? data : mockRebalanceProposals);
      setUsingMock(data.length === 0);
    } catch {
      setProposals(mockRebalanceProposals);
      setUsingMock(true);
    }
  };
  load();
}, []);

  // Refresh a single proposal from the ledger after an action
  const refreshProposal = useCallback(async (ticker: string, proposalId: string) => {
    try {
      const updated = await getProposal(AUTH_HEADER, ticker, proposalId);
      setProposals(prev => prev.map(p => p.proposalId === proposalId ? updated : p));
      setSelected(updated);
    } catch {
      // keep existing state if refresh fails
    }
  }, []);

  const handleApprove = async (proposal: RebalanceProposal) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await approveProposal(AUTH_HEADER, proposal.ticker, proposal.proposalId);
      if (usingMock) {
        // update local state only
        const updated = { ...proposal, status: 'Approved' as const };
        setProposals(prev => prev.map(p => p.proposalId === proposal.proposalId ? updated : p));
        setSelected(updated);
      } else {
        await refreshProposal(proposal.ticker, proposal.proposalId);
      }
    } catch {
      setActionError('Approve failed — check ledger connection');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (proposal: RebalanceProposal) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await rejectProposal(AUTH_HEADER, proposal.ticker, proposal.proposalId);
      if (usingMock) {
        const updated = { ...proposal, status: 'Rejected' as const };
        setProposals(prev => prev.map(p => p.proposalId === proposal.proposalId ? updated : p));
        setSelected(updated);
      } else {
        await refreshProposal(proposal.ticker, proposal.proposalId);
      }
    } catch {
      setActionError('Reject failed — check ledger connection');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecute = async (proposal: RebalanceProposal) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await executeProposal(AUTH_HEADER, proposal.ticker, proposal.proposalId);
      if (usingMock) {
        const updated = { ...proposal, status: 'Executed' as const };
        setProposals(prev => prev.map(p => p.proposalId === proposal.proposalId ? updated : p));
        setSelected(updated);
      } else {
        await refreshProposal(proposal.ticker, proposal.proposalId);
      }
    } catch {
      setActionError('Execute failed — check ledger connection');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-canton-text">Rebalancing</h1>
          <p className="text-canton-muted text-sm mt-1">
            Multi-party approval workflow — enforced on Canton ledger
          </p>
        </div>
        {usingMock && (
          <span className="text-canton-yellow text-xs border border-canton-yellow/30 bg-canton-yellow/10 px-3 py-1 rounded-lg">
            Mock data — ledger unavailable
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Proposals list */}
        <div className="col-span-1 space-y-3">
          <h2 className="text-canton-text font-semibold text-sm uppercase tracking-wide">
            Proposals
          </h2>
          {proposals.map(proposal => {
            const config = statusConfig[proposal.status];
            const Icon = config.icon;
            return (
              <button
                key={proposal.proposalId}
                onClick={() => { setSelected(proposal); setActionError(null); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.proposalId === proposal.proposalId
                    ? 'border-canton-accent bg-canton-card'
                    : 'border-canton-border bg-canton-card hover:border-canton-accent/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-canton-text font-medium text-sm">
                    {proposal.ticker} — {proposal.proposalId}
                  </span>
                  <Icon size={14} className={config.color} />
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs ${config.bg} ${config.color}`}>
                  {proposal.status}
                </div>
                <p className="text-canton-muted text-xs mt-2">
                  {new Date(proposal.proposedAt).toLocaleString()}
                </p>
              </button>
            );
          })}
        </div>

        {/* Proposal detail */}
        <div className="col-span-2">
          {selected ? (
            <div className="bg-canton-card border border-canton-border rounded-xl p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-canton-text font-bold text-lg">
                    {selected.ticker} Rebalance — {selected.proposalId}
                  </h2>
                  <p className="text-canton-muted text-sm mt-1">
                    Proposed {new Date(selected.proposedAt).toLocaleString()}
                  </p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium
                  ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                  {selected.status}
                </div>
              </div>

              {/* Regulation badge */}
              <div className="bg-canton-darker border border-canton-border rounded-lg p-4">
                <p className="text-canton-muted text-xs uppercase tracking-wide mb-1">
                  Regulatory Status
                </p>
                <p className={`text-sm font-medium ${statusConfig[selected.status].color}`}>
                  {regulationMap[selected.status]}
                </p>
              </div>

              {/* New weights */}
              <div>
                <h3 className="text-canton-text font-semibold text-sm mb-3">
                  Proposed Weights
                </h3>
                <div className="space-y-2">
                  {selected.newWeights.map(w => (
                    
                    <div key={w.symbol} className="flex items-center gap-3">
                      <span className="text-canton-text text-sm w-16 font-medium">
                        {w.symbol}
                      </span>
                      <div className="flex-1 bg-canton-darker rounded-full h-2">
                        <div
                          className="bg-canton-accent h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(w.weight > 1 ? w.weight : w.weight * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-canton-muted text-sm w-12 text-right">
                        {(w.weight > 1 ? w.weight : w.weight * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {actionError && (
                <div className="bg-canton-red/10 border border-canton-red/30 rounded-lg px-4 py-3">
                  <p className="text-canton-red text-sm">{actionError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-canton-border">
                {actionLoading ? (
                  <div className="flex items-center gap-2 text-canton-muted text-sm">
                    <RefreshCw size={14} className="animate-spin" /> Submitting to ledger…
                  </div>
                ) : (
                  <>
                    {currentRole === 'ComplianceOfficer' && selected.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(selected)}
                          className="flex items-center gap-2 px-4 py-2 bg-canton-green text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle size={14} />
                          Approve — SEC 38a-1
                        </button>
                        <button
                          onClick={() => handleReject(selected)}
                          className="flex items-center gap-2 px-4 py-2 bg-canton-red text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    {currentRole === 'FundManager' && selected.status === 'Approved' && (
                      <button
                        onClick={() => handleExecute(selected)}
                        className="flex items-center gap-2 px-4 py-2 bg-canton-accent text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        <Play size={14} />
                        Execute Rebalance — SEC 22c-1
                      </button>
                    )}
                    {selected.status === 'Executed' && (
                      <div className="flex items-center gap-2 text-canton-green text-sm">
                        <CheckCircle size={14} />
                        Executed on Canton ledger — immutable record created
                      </div>
                    )}
                    {selected.status === 'Rejected' && (
                      <div className="flex items-center gap-2 text-canton-red text-sm">
                        <XCircle size={14} />
                        Rejected by ComplianceOfficer — recorded on ledger
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-canton-card border border-canton-border rounded-xl p-6 flex items-center justify-center h-64">
              <p className="text-canton-muted">Select a proposal to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}