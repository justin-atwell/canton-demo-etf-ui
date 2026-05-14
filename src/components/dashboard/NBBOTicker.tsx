import { useEffect, useState } from 'react';
import { mockNBBOQuotes } from '../../data/mockData';

interface Quote {
  symbol: string;
  bid: number;
  ask: number;
  time: string;
  change: number;
}

export default function NBBOTicker() {
  const [quotes, setQuotes] = useState<Quote[]>(
    mockNBBOQuotes.map(q => ({ ...q, change: 0 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes(prev => prev.map(q => {
        const change = (Math.random() - 0.5) * 0.5;
        return {
          ...q,
          bid: parseFloat((q.bid + change).toFixed(2)),
          ask: parseFloat((q.ask + change).toFixed(2)),
          change,
          time: new Date().toISOString(),
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-canton-card border border-canton-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-canton-text font-semibold">Live NBBO</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-canton-accent rounded-full animate-pulse" />
          <span className="text-canton-muted text-xs">Polygon.io • On-chain</span>
        </div>
      </div>

      <div className="space-y-2">
        {quotes.map(quote => (
          <div key={quote.symbol}
            className="flex items-center justify-between py-2 border-b border-canton-border last:border-0">
            <span className="text-canton-text font-medium text-sm w-16">{quote.symbol}</span>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-canton-muted text-xs">Bid</p>
                <p className="text-canton-text text-sm font-mono">${quote.bid.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-canton-muted text-xs">Ask</p>
                <p className="text-canton-text text-sm font-mono">${quote.ask.toFixed(2)}</p>
              </div>
              <div className="w-16 text-right">
                <p className={`text-sm font-mono ${quote.change >= 0 ? 'text-canton-green' : 'text-canton-red'}`}>
                  {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}