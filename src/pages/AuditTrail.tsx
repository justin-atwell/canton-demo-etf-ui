import { useState } from 'react';
import { CheckCircle, XCircle, Filter } from 'lucide-react';
import type { AccessEvent } from '../types';
import { mockAccessEvents } from '../data/mockData';

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

// Extend mock data for this page
const extendedEvents: AccessEvent[] = [
  ...mockAccessEvents,
  {
    actor: 'FundManager::abc123',
    action: 'EXECUTE_REBALANCE',
    resource: 'QQQ-REB-002',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    granted: true,
  },
  {
    actor: 'Custodian::ghi789',
    action: 'RELEASE_COLLATERAL',
    resource: 'ACC-002',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    granted: true,
  },
  {
    actor: 'MarketMaker::mno345',
    action: 'POST_NBBO',
    resource: 'MSFT',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    granted: true,
  },
  {
    actor: 'Auditor::jkl012',
    action: 'VIEW_CAPTABLE',
    resource: 'QQQ',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    granted: true,
  },
  {
    actor: 'FundManager::abc123',
    action: 'POST_NAV',
    resource: 'SPY',
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    granted: true,
  },
];

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function shortParty(partyId: string): string {
  return partyId.split('::')[0];
}

export default function AuditTrail() {
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterGranted, setFilterGranted] = useState<string>('');

  const filtered = extendedEvents.filter(e => {
    if (filterAction && e.action !== filterAction) return false;
    if (filterGranted === 'granted' && !e.granted) return false;
    if (filterGranted === 'denied' && e.granted) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-canton-text">Audit Trail</h1>
        <p className="text-canton-muted text-sm mt-1">
          Immutable on-chain access events — SEC Rule 17a-4 compliant
        </p>
      </div>

      {/* Immutability banner */}
      <div className="bg-canton-card border border-canton-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-canton-green rounded-full animate-pulse" />
          <span className="text-canton-text text-sm font-medium">
            {extendedEvents.length} immutable records on Canton ledger
          </span>
          <span className="text-canton-muted text-sm">•</span>
          <span className="text-canton-muted text-sm">
            Cannot be modified or deleted by design
          </span>
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
          {filtered.length} of {extendedEvents.length} events
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

        {filtered.map((event, i) => (
          <div
            key={i}
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
        ))}
      </div>
    </div>
  );
}