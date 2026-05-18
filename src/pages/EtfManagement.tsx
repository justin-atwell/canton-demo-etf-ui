import { useState } from 'react';
import type { Role, ConstituentDetail } from '../types';
import { useEtfManagement } from '../hooks/useEtfManagement';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

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

function NavChart({ data, view, onViewChange }: {
  data: { date: string; navPerShare: number; totalAUM: number }[];
  view: 'nav' | 'aum';
  onViewChange: (v: 'nav' | 'aum') => void;
}) {
  if (!data || data.length === 0) return null;
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fmtAUM = (v: number) => `$${(v / 1_000_000).toFixed(0)}M`;

  return (
    <div className="bg-canton-card border border-canton-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-canton-text text-sm font-semibold">NAV History</p>
          <p className="text-canton-muted text-xs mt-0.5">60-day rolling window</p>
        </div>
        <div className="flex bg-canton-darker rounded-md p-0.5">
          {(['nav', 'aum'] as const).map(v => (
            <button key={v} onClick={() => onViewChange(v)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                view === v ? 'bg-canton-accent text-white' : 'text-canton-muted hover:text-canton-text'
              }`}>
              {v === 'nav' ? 'NAV/Share' : 'Total AUM'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        {view === 'nav' ? (
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="navDate" tickFormatter={fmt} tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `$${v.toFixed(2)}`} width={55} />
            <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 6, fontSize: 12 }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, 'NAV/Share']}
              labelFormatter={fmt} />
            <Line type="monotone" dataKey="navPerShare" stroke="#3b82f6" strokeWidth={2} dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        ) : (
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="navDate" tickFormatter={fmt} tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={fmtAUM} width={55} />
            <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid #1e2d4a', borderRadius: 6, fontSize: 12 }}
              formatter={(v: number) => [fmtAUM(v), 'Total AUM']} labelFormatter={fmt} />
            <Area type="monotone" dataKey="totalAUM" stroke="#3b82f6" strokeWidth={2}
              fill="url(#aumGrad)" dot={false} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function DriftBar({ target, current }: { target: number; current: number }) {
  const drift = current - target;
  const color = Math.abs(drift) > 2 ? 'bg-canton-red' : Math.abs(drift) > 0.5 ? 'bg-canton-yellow' : 'bg-canton-green';
  const textColor = Math.abs(drift) > 2 ? 'text-canton-red' : Math.abs(drift) > 0.5 ? 'text-canton-yellow' : 'text-canton-green';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-canton-muted">
        <span>Target {target.toFixed(1)}%</span>
        <span className={textColor}>{drift > 0 ? '+' : ''}{drift.toFixed(2)}%</span>
      </div>
      <div className="relative h-1.5 bg-white/5 rounded-full">
        <div className={`absolute left-0 top-0 h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(current, 100)}%` }} />
        <div className="absolute top-[-3px] w-0.5 h-[9px] bg-canton-muted rounded-sm"
          style={{ left: `${target}%` }} />
      </div>
      <p className="text-xs text-canton-text text-right tabular-nums">Current {current.toFixed(1)}%</p>
    </div>
  );
}

function ConstituentRow({ c, editing, draftWeight, onWeightChange }: {
  c: ConstituentDetail;
  editing: boolean;
  draftWeight: number;
  onWeightChange: (id: string, v: number) => void;
}) {
  const drift = Math.abs(c.currentWeight - c.targetWeight);
  return (
    <tr className="border-b border-canton-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3.5">
        <span className="font-mono font-bold text-canton-accent text-sm">{c.ticker}</span>
      </td>
      <td className="px-4 py-3.5 text-canton-text text-sm">{c.name}</td>
      <td className="px-4 py-3.5 font-mono text-canton-muted text-xs">{c.cusip}</td>
      <td className="px-4 py-3.5 text-canton-text text-sm tabular-nums">
        ${c.lastPrice.toLocaleString()}
      </td>
      <td className="px-4 py-3.5 text-sm tabular-nums">
        <span className={c.priceChange24h >= 0 ? 'text-canton-green' : 'text-canton-red'}>
          {c.priceChange24h >= 0 ? '+' : ''}{c.priceChange24h.toFixed(2)}%
        </span>
      </td>
      <td className="px-4 py-3.5 min-w-[200px]">
        {editing ? (
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={100} step={0.5} value={draftWeight}
              onChange={e => onWeightChange(c.contractId, parseFloat(e.target.value))}
              className="flex-1 accent-canton-accent" />
            <span className="text-canton-text text-sm tabular-nums w-10 text-right">
              {draftWeight.toFixed(1)}%
            </span>
          </div>
        ) : (
          <DriftBar target={c.targetWeight} current={c.currentWeight} />
        )}
      </td>
      <td className="px-4 py-3.5">
        {drift < 0.5
          ? <span className="flex items-center gap-1 text-canton-green text-xs"><CheckCircle size={12} /> On target</span>
          : drift < 2
          ? <span className="flex items-center gap-1 text-canton-yellow text-xs"><AlertTriangle size={12} /> Minor drift</span>
          : <span className="flex items-center gap-1 text-canton-red text-xs"><AlertTriangle size={12} /> Rebalance</span>
        }
      </td>
    </tr>
  );
}

export default function EtfManagement({ currentRole }: Props) {
  const { etf, navHistory, loading, proposalId, propose, refresh, clearProposal } =
    useEtfManagement('CXBT', currentRole);

  const [navView, setNavView] = useState<'nav' | 'aum'>('nav');
  const [editing, setEditing] = useState(false);
  const [draftWeights, setDraftWeights] = useState<Record<string, number>>({});

const startEditing = () => {
  if (!etf) return;
  setDraftWeights(Object.fromEntries(etf.constituents.map(c => [c.ticker, c.targetWeight])));
  setEditing(true);
};

  const cancelEditing = () => {
    setEditing(false);
    setDraftWeights({});
  };

  const totalDraft = Object.values(draftWeights).reduce((s, v) => s + v, 0);
  const canSubmit = Math.abs(totalDraft - 100) < 0.01;

  const handlePropose = async () => {
    await propose(draftWeights);
    setEditing(false);
    setDraftWeights({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={20} className="text-canton-accent animate-spin" />
        <span className="text-canton-muted text-sm ml-3">Querying ledger…</span>
      </div>
    );
  }

  if (!etf) return null;

  const aumFmt = etf.totalAUM >= 1_000_000_000
    ? `$${(etf.totalAUM / 1_000_000_000).toFixed(2)}B`
    : `$${(etf.totalAUM / 1_000_000).toFixed(1)}M`;

  const driftCount = etf.constituents.filter(c => Math.abs(c.currentWeight - c.targetWeight) > 2).length;
  const maxDrift = Math.max(...etf.constituents.map(c => Math.abs(c.currentWeight - c.targetWeight)));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-canton-accent" />
            <h1 className="text-canton-text text-xl font-bold">{etf.ticker}</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
              etf.status === 'Active'
                ? 'bg-canton-green/10 text-canton-green border border-canton-green/30'
                : 'bg-canton-red/10 text-canton-red border border-canton-red/30'
            }`}>
              {etf.status}
            </span>
            {currentRole === 'FundManager' && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide bg-canton-yellow/10 text-canton-yellow border border-canton-yellow/30">
                Fund Manager
              </span>
            )}
          </div>
          <p className="text-canton-muted text-sm mt-1">
            {etf.name} · CUSIP {etf.cusip} · Inception {etf.inceptionDate}
          </p>
        </div>
        <button onClick={refresh}
          className="flex items-center gap-2 px-3 py-2 bg-canton-card border border-canton-border rounded-lg text-canton-muted text-sm hover:text-canton-text transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="NAV Per Share" value={`$${etf.navPerShare.toFixed(2)}`} sub="Last batch" highlight="accent" />
        <MetricCard label="Total AUM" value={aumFmt} sub="USD" />
        <MetricCard label="Constituents" value={String(etf.constituents.length)}
          sub={`${driftCount} require rebalance`}
          highlight={driftCount > 0 ? 'yellow' : 'green'} />
        <MetricCard label="Max Drift" value={`${maxDrift.toFixed(2)}%`} sub="vs. target"
          highlight={maxDrift > 2 ? 'red' : maxDrift > 0.5 ? 'yellow' : 'green'} />
      </div>

      {/* NAV chart */}
      <NavChart data={navHistory} view={navView} onViewChange={setNavView} />

      {/* Constituent table */}
      <div className="bg-canton-card border border-canton-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-canton-border">
          <div>
            <p className="text-canton-text text-sm font-semibold">Constituent Weights</p>
            <p className="text-canton-muted text-xs mt-0.5">
              {etf.constituents.length} constituents · SEC 22c-1 · FINRA 3110
            </p>
          </div>
          <div className="flex items-center gap-3">
            {editing && (
              <span className={`text-sm tabular-nums font-mono ${canSubmit ? 'text-canton-green' : 'text-canton-red'}`}>
                Σ {totalDraft.toFixed(2)}%
              </span>
            )}
            {currentRole === 'FundManager' && !editing && (
              <button onClick={startEditing}
                className="px-3 py-1.5 bg-canton-accent/10 border border-canton-accent/40 text-canton-accent text-xs font-semibold rounded-md hover:bg-canton-accent/20 transition-colors">
                Propose Rebalance
              </button>
            )}
            {editing && (
              <>
                <button onClick={cancelEditing}
                  className="px-3 py-1.5 border border-canton-border text-canton-muted text-xs rounded-md hover:text-canton-text transition-colors">
                  Cancel
                </button>
                <button onClick={handlePropose} disabled={!canSubmit}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    canSubmit
                      ? 'bg-canton-accent text-white hover:bg-canton-accent/90'
                      : 'bg-canton-accent/20 text-canton-muted cursor-not-allowed'
                  }`}>
                  Submit Proposal →
                </button>
              </>
            )}
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              {['Ticker', 'Name', 'CUSIP', 'Last Price', '24h', 'Weight Allocation', 'Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-canton-muted uppercase tracking-wide border-b border-canton-border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {etf.constituents.map(c => (
              <ConstituentRow
                key={c.contractId}
                c={c}
                editing={editing && currentRole === 'FundManager'}
                draftWeight={draftWeights[c.ticker] ?? c.targetWeight}
                onWeightChange={(_id, v) => setDraftWeights(prev => ({ ...prev, [c.ticker]: v }))}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Proposal toast */}
      {proposalId && (
        <div className="fixed bottom-6 right-6 bg-canton-card border border-canton-green/40 rounded-lg px-5 py-4 flex items-start gap-3 shadow-xl z-50 max-w-sm">
          <CheckCircle size={18} className="text-canton-green mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-canton-green text-sm font-semibold">Rebalance Proposal Submitted</p>
            <p className="text-canton-muted text-xs font-mono mt-1">{proposalId}</p>
            <p className="text-canton-muted text-xs mt-1">Awaiting ComplianceOfficer approval · SEC 38a-1</p>
          </div>
          <button onClick={clearProposal} className="text-canton-muted hover:text-canton-text text-lg leading-none">×</button>
        </div>
      )}

    </div>
  );
}