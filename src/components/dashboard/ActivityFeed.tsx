import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import type { AccessEvent } from '../../types';
import { mockAccessEvents } from '../../data/mockData';

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

function getRegulation(action: string): string {
  const map: Record<string, string> = {
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
  return map[action] || 'SEC 17a-4';
}

function shortParty(partyId: string): string {
  return partyId.split('::')[0];
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<AccessEvent[]>(mockAccessEvents);

  // Simulate new events arriving
  useEffect(() => {
    const actions = ['POST_NBBO', 'VIEW_CAPTABLE', 'POST_NAV', 'LOCK_COLLATERAL'];
    const actors = ['MarketMaker::mno345', 'Auditor::jkl012', 'FundManager::abc123', 'Custodian::ghi789'];

    const interval = setInterval(() => {
      const newEvent: AccessEvent = {
        actor: actors[Math.floor(Math.random() * actors.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: 'SPY',
        timestamp: new Date().toISOString(),
        granted: true,
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-canton-card border border-canton-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-canton-text font-semibold">Live Audit Trail</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-canton-green rounded-full animate-pulse" />
          <span className="text-canton-muted text-xs">On-chain • Immutable</span>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((event, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-canton-border last:border-0 animate-fade-in"
          >
            {event.granted
              ? <CheckCircle size={14} className="text-canton-green flex-shrink-0" />
              : <XCircle size={14} className="text-canton-red flex-shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-canton-text text-xs font-medium truncate">
                  {shortParty(event.actor)}
                </span>
                <span className="text-canton-muted text-xs">→</span>
                <span className="text-canton-accent text-xs">{event.action}</span>
                <span className="text-canton-muted text-xs">on</span>
                <span className="text-canton-text text-xs">{event.resource}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs bg-canton-border text-canton-muted px-2 py-0.5 rounded">
                {getRegulation(event.action)} ✓
              </span>
              <span className="text-canton-muted text-xs w-12 text-right">
                {timeAgo(event.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}