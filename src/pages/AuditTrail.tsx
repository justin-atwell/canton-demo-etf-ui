import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Filter, RefreshCw } from 'lucide-react';
import type { AccessEvent, Role } from '../types';
import { mockAccessEvents } from '../data/mockData';
import { getAccessEvents } from '../api/audit';


interface Props {
  currentRole: Role;
  partyId: string;
}

const allActions = ['CREATE_ETF', 'APPROVE_REBALANCE', 'REJECT_REBALANCE',
  'EXECUTE_REBALANCE', 'LOCK_COLLATERAL', 'RELEASE_COLLATERAL',
  'POST_NAV', 'POST_NBBO', 'VIEW_CAPTABLE'];

const regulationMap: Record<string, string> = {
  CREATE_ETF: 'SEC 38a-1',
  APPROVE_REBALANCE: 'SEC 38a-1',
  REJECT_REBALANCE: 'SEC 38a-1',
  EXECUTE_REBALANCE: 'SEC 22c-1',
  LOCK_COLLATERAL: 'Basel III',
  RELEASE_COLLATERAL: 'Basel III',
  POST_NAV: 'SEC 22c-1',
  POST_NBBO: 'Reg SHO',
  VIEW_CAPTABLE: 'FINRA 3110',
};

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function shortParty(partyId: string): string {
  return partyId.split('::')[0];
}

export default function AuditTrail({ currentRole, partyId }: Props) {
  const [events, setEvents] = useState<AccessEvent[]>(mockAccessEvents);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterGranted, setFilterGranted] = useState<string>('');
  const AUTH_HEADER = `Bearer dev-${currentRole}`;

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAccessEvents(AUTH_HEADER);
      setEvents(data);
      setUsingMock(false);
    } catch {
      setEvents(mockAccessEvents);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [partyId]);

  const filtered = events.filter(e => {
    if (filterAction && e.action !== filterAction) return false;
    if (filterGranted === 'granted' && !e.granted) return false;
    if (filterGranted === 'denied' && e.granted) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-canton-text">Audit Trail</h1>
          <p className="text-canton-muted text-sm mt-1">
            Immutable on-chain access events — SEC Rule 17a-4 compliant
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 px-3 py-2 bg-canton-card border border-canton-border rounded-lg text-canton-muted text-sm hover:text-canton-text transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Immutability banner */}
      <div className="bg-canton-card border border-canton-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-canton-green rounded-full animate-pulse" />
          <span className="text-canton-text text-sm font-medium">
            {events.length} immutable records on Canton ledger
          </span>
          <span className="text-canton-muted text-sm">•</span>
          <span className="text-canton-muted text-sm">
            Cannot be modified or deleted by design
          </span>
          {usingMock && (
            <>
              <span className="text-canton-muted text-sm">•</span>
              <span className="text-canton-yellow text-xs">Mock data — ledger unavailable</span>
            </>
          )}
        </div>
        <span className="text-xs bg-green-500/10 border border-green-500/20
          text-canton-green px-3 py-1 rounded-lg">
          SEC 17a-4 ✓
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-canton-muted" />
        <select
          value={filterAction}
          onChange={e => setFilterAction(e.target.value)}
          className="bg-canton-card border border-canton-border text-canton-text
            text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-canton-accent"
        >
          <option value="">All Actions</option>
          {allActions.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filterGranted}
          onChange={e => setFilterGranted(e.target.value)}
          className="bg-canton-card border border-canton-border text-canton-text
            text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-canton-accent"
        >
          <option value="">All Results</option>
          <option value="granted">Granted</option>
          <option value="denied">Denied</option>
        </select>
        <span className="text-canton-muted text-sm">
          {filtered.length} of {events.length} events
        </span>
      </div>

      {/* Events table */}
      <div className="bg-canton-card border border-canton-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-canton-border bg-canton-darker">
          <div className="col-span-1 text-canton-muted text-xs uppercase tracking-wide">Status</div>
          <div className="col-span-2 text-canton-muted text-xs uppercase tracking-wide">Actor</div>
          <div className="col-span-3 text-canton-muted text-xs uppercase tracking-wide">Action</div>
          <div className="col-span-2 text-canton-muted text-xs uppercase tracking-wide">Resource</div>
          <div className="col-span-2 text-canton-muted text-xs uppercase tracking-wide">Regulation</div>
          <div className="col-span-2 text-canton-muted text-xs uppercase tracking-wide">Time</div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={18} className="text-canton-accent animate-spin" />
            <span className="text-canton-muted text-sm ml-3">Querying ledger…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-canton-muted text-sm">No events found</span>
          </div>
        ) : (
          filtered.map((event) => (
            <div
              key={event.contractId}
              className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-canton-border
                last:border-0 hover:bg-canton-darker transition-colors items-center"
            >
              <div className="col-span-1">
                {event.granted
                  ? <CheckCircle size={16} className="text-canton-green" />
                  : <XCircle size={16} className="text-canton-red" />
                }
              </div>
              <div className="col-span-2">
                <span className="text-canton-text text-sm">{shortParty(event.actor)}</span>
              </div>
              <div className="col-span-3">
                <span className="text-canton-accent text-sm font-mono">{event.action}</span>
              </div>
              <div className="col-span-2">
                <span className="text-canton-muted text-sm">{event.resource}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs bg-canton-border text-canton-muted px-2 py-0.5 rounded">
                  {regulationMap[event.action] || 'SEC 17a-4'} ✓
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-canton-muted text-sm">{timeAgo(event.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}