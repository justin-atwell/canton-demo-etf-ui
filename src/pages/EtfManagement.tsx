import { useState } from 'react';
import type { Role, CollateralAccount, CollateralLock, MarginCall } from '../types';
import { useCollateral } from '../hooks/useCollateral';
import { Shield, RefreshCw, Lock, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  currentRole: Role;
}

function MetricCard({ label, value, sub, highlight }: {
  label: string;
  value: string;
  sub?: string;
  highlight?: 'green' | 'yellow' | 'red' | 'accent';
}) {
  const colors = {
    green:  'text-canton-green',
    yellow: 'text-canton-yellow',
    red:    'text-canton-red',
    accent: 'text-canton-accent',
  };
  return (
    <div className="bg-canton-card border border-canton-border rounded-lg p-4">
      <p className="text-canton-muted text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${highlight ? colors[highlight] : 'text-canton-text'}`}>
        {value}
      </p>
      {sub && <p className="text-canton-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}

function AccountRow({ account }: { account: CollateralAccount }) {
  // balance is the total; no locked/available split from API — show balance only
  return (
    <tr className="border-b border-canton-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3.5">
        <span className="font-mono font-bold text-canton-accent text-sm">{account.accountId}</span>
      </td>
      <td className="px-4 py-3.5 text-canton-text text-sm">{account.asset}</td>
      <td className="px-4 py-3.5 text-canton-text text-sm tabular-nums">
        {account.balance.toLocaleString()}
      </td>
      <td className="px-4 py-3.5 text-canton-muted text-xs truncate max-w-[140px]">
        {account.custodian.split('::')[0]}
      </td>
      <td className="px-4 py-3.5 text-canton-muted text-xs truncate max-w-[140px]">
        {account.fundManager.split('::')[0]}
      </td>
      <td className="px-4 py-3.5">
        <span className="font-mono text-canton-muted text-xs truncate max-w-[140px] block">
          {account.contractId}
        </span>
      </td>
    </tr>
  );
}

function LockRow({ lock }: { lock: CollateralLock }) {
  const isExpired = new Date(lock.expiry) < new Date();
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <tr className="border-b border-canton-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3.5">
        <span className="font-mono font-bold text-canton-accent text-sm">
          {lock.contractId.slice(-8)}
        </span>
      </td>
      <td className="px-4 py-3.5 text-canton-text text-sm">{lock.asset}</td>
      <td className="px-4 py-3.5 text-canton-text text-sm tabular-nums">{lock.amount.toLocaleString()}</td>
      <td className="px-4 py-3.5 text-canton-text text-sm max-w-[200px]">
        <span className="truncate block">{lock.reason}</span>
      </td>
      <td className="px-4 py-3.5 text-canton-muted text-xs">{fmtDate(lock.lockedAt)}</td>
      <td className="px-4 py-3.5">
        {isExpired ? (
          <span className="flex items-center gap-1 text-canton-red text-xs">
            <AlertTriangle size={11} /> Expired
          </span>
        ) : (
          <span className="flex items-center gap-1 text-canton-green text-xs">
            <Clock size={11} /> {fmtDate(lock.expiry)}
          </span>
        )}
      </td>
    </tr>
  );
}

function MarginCallRow({ call }: { call: MarginCall }) {
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  const isPastDue = new Date(call.dueBy) < new Date() && call.status === 'Pending';

  const statusConfig = {
    Pending:   { color: 'text-canton-yellow', bg: 'bg-canton-yellow/10', border: 'border-canton-yellow/30', icon: <Clock size={11} /> },
    Met:       { color: 'text-canton-green',  bg: 'bg-canton-green/10',  border: 'border-canton-green/30',  icon: <CheckCircle size={11} /> },
    Defaulted: { color: 'text-canton-red',    bg: 'bg-canton-red/10',    border: 'border-canton-red/30',    icon: <AlertTriangle size={11} /> },
  }[call.status];

  return (
    <tr className="border-b border-canton-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3.5">
        <span className="font-mono font-bold text-canton-accent text-sm">
          {call.contractId.slice(-8)}
        </span>
      </td>
      <td className="px-4 py-3.5 text-canton-text text-sm">{call.asset}</td>
      <td className="px-4 py-3.5 text-canton-text text-sm tabular-nums">
        {call.amountRequired.toLocaleString()}
      </td>
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}>
          {statusConfig.icon} {call.status}
        </span>
      </td>
      <td className="px-4 py-3.5 text-canton-muted text-xs">{fmtDate(call.issuedAt)}</td>
      <td className="px-4 py-3.5">
        <span className={`text-xs ${isPastDue ? 'text-canton-red font-semibold' : 'text-canton-muted'}`}>
          {isPastDue ? '⚠ ' : ''}{fmtDate(call.dueBy)}
        </span>
      </td>
    </tr>
  );
}

type Tab = 'accounts' | 'locks' | 'margin-calls';

export default function CollateralMonitor({ currentRole }: Props) {
  const { accounts, locks, marginCalls, loading, actionError, refresh, clearError } =
    useCollateral(currentRole);

  const [tab, setTab] = useState<Tab>('accounts');

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const pendingCalls = marginCalls.filter(m => m.status === 'Pending').length;
  const activeLocks = locks.length;

  const fmtUSD = (v: number) => v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(2)}M`
    : `$${v.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={20} className="text-canton-accent animate-spin" />
        <span className="text-canton-muted text-sm ml-3">Querying ledger…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-canton-accent" />
          <div>
            <h1 className="text-canton-text text-xl font-bold">Collateral Monitor</h1>
            <p className="text-canton-muted text-sm mt-0.5">
              Basel III · Reg SHO · SEC 17a-4
            </p>
          </div>
        </div>
        <button onClick={refresh}
          className="flex items-center gap-2 px-3 py-2 bg-canton-card border border-canton-border rounded-lg text-canton-muted text-sm hover:text-canton-text transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total Balance" value={fmtUSD(totalBalance)} sub="All accounts" highlight="accent" />
        <MetricCard label="Active Locks" value={String(activeLocks)} sub="Across all accounts"
          highlight={activeLocks > 0 ? 'yellow' : 'green'} />
        <MetricCard label="Pending Margin Calls" value={String(pendingCalls)} sub="Awaiting settlement"
          highlight={pendingCalls > 0 ? 'red' : 'green'} />
        <MetricCard label="Total Accounts" value={String(accounts.length)} sub="On ledger" />
      </div>

      {/* Tab bar */}
      <div className="bg-canton-card border border-canton-border rounded-lg overflow-hidden">
        <div className="flex border-b border-canton-border">
          {([
            { id: 'accounts',     label: 'Accounts',      count: accounts.length },
            { id: 'locks',        label: 'Active Locks',  count: locks.length },
            { id: 'margin-calls', label: 'Margin Calls',  count: marginCalls.length },
          ] as { id: Tab; label: string; count: number }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === t.id
                  ? 'border-canton-accent text-canton-accent'
                  : 'border-transparent text-canton-muted hover:text-canton-text'
              }`}>
              {t.label}
              <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                tab === t.id
                  ? 'bg-canton-accent/20 text-canton-accent'
                  : 'bg-white/5 text-canton-muted'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Accounts tab */}
        {tab === 'accounts' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                {['Account ID', 'Asset', 'Balance', 'Custodian', 'Fund Manager', 'Contract ID'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-canton-muted uppercase tracking-wide border-b border-canton-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => <AccountRow key={a.contractId} account={a} />)}
            </tbody>
          </table>
        )}

        {/* Locks tab */}
        {tab === 'locks' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                {['Lock ID', 'Asset', 'Amount', 'Reason', 'Locked At', 'Expires'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-canton-muted uppercase tracking-wide border-b border-canton-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locks.map(l => <LockRow key={l.contractId} lock={l} />)}
            </tbody>
          </table>
        )}

        {/* Margin calls tab */}
        {tab === 'margin-calls' && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                {['Call ID', 'Asset', 'Amount Required', 'Status', 'Issued', 'Due By'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-canton-muted uppercase tracking-wide border-b border-canton-border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marginCalls.map(m => <MarginCallRow key={m.contractId} call={m} />)}
            </tbody>
          </table>
        )}
      </div>

      {/* Error toast */}
      {actionError && (
        <div className="fixed bottom-6 right-6 bg-canton-card border border-canton-red/40 rounded-lg px-5 py-4 flex items-start gap-3 shadow-xl z-50 max-w-sm">
          <AlertTriangle size={18} className="text-canton-red mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-canton-red text-sm font-semibold">Action Failed</p>
            <p className="text-canton-muted text-xs mt-1">{actionError}</p>
          </div>
          <button onClick={clearError} className="text-canton-muted hover:text-canton-text text-lg leading-none">×</button>
        </div>
      )}

    </div>
  );
}