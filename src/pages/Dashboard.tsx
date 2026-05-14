import { TrendingUp, DollarSign, Shield, AlertCircle } from 'lucide-react';

const stats = [
  {
    label: 'NAV Per Share',
    value: '$479.32',
    change: '+1.24%',
    positive: true,
    icon: TrendingUp,
    color: 'text-canton-accent',
  },
  {
    label: 'Total AUM',
    value: '$4.2B',
    change: '+$84M today',
    positive: true,
    icon: DollarSign,
    color: 'text-canton-green',
  },
  {
    label: 'Active Collateral',
    value: '$892M',
    change: '14 active locks',
    positive: true,
    icon: Shield,
    color: 'text-purple-400',
  },
  {
    label: 'Pending Actions',
    value: '3',
    change: '2 rebalances, 1 margin call',
    positive: false,
    icon: AlertCircle,
    color: 'text-canton-yellow',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-canton-text">Dashboard</h1>
        <p className="text-canton-muted text-sm mt-1">
          Canton ETF Platform — Live on DevNet
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-canton-card border border-canton-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-canton-muted text-sm">{stat.label}</span>
                <Icon size={18} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-canton-text">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.positive ? 'text-canton-green' : 'text-canton-yellow'}`}>
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}