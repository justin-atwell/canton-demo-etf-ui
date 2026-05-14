import { CheckCircle, Shield } from 'lucide-react';

const complianceData = [
  {
    contract: 'AccessEvent',
    regulation: 'FINRA Rule 3110',
    requirement: 'Supervision & immutable audit trail',
    status: 'satisfied',
    description: 'Every access decision written on-chain. Cannot be modified or deleted.',
  },
  {
    contract: 'RebalanceProposal',
    regulation: 'SEC Rule 38a-1',
    requirement: 'Compliance approval workflow',
    status: 'satisfied',
    description: 'ComplianceOfficer signature required before execution. Cryptographically enforced.',
  },
  {
    contract: 'NAV',
    regulation: 'SEC Rule 22c-1',
    requirement: 'Daily NAV pricing requirement',
    status: 'satisfied',
    description: 'Immutable NAV records with ledger timestamp. Cannot be backdated.',
  },
  {
    contract: 'CollateralLock + HaircutSchedule',
    regulation: 'Basel III',
    requirement: 'Collateral management & haircut enforcement',
    status: 'satisfied',
    description: 'Haircut rates set by ComplianceOfficer. Locks cryptographically enforced by Custodian.',
  },
  {
    contract: 'NBBOQuote + ExecutionReport',
    regulation: 'Reg SHO',
    requirement: 'Best execution compliance',
    status: 'satisfied',
    description: 'On-chain NBBO from Polygon.io. Execution reports immutably recorded.',
  },
  {
    contract: 'AccessEvent + RebalanceExecution',
    regulation: 'SEC Rule 17a-4',
    requirement: 'Records retention',
    status: 'satisfied',
    description: 'All records immutable on Canton ledger. No deletion possible by design.',
  },
];

export default function Compliance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-canton-text">Compliance Panel</h1>
        <p className="text-canton-muted text-sm mt-1">
          Regulatory requirements satisfied by Canton smart contracts
        </p>
      </div>

      {/* Summary banner */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-canton-green rounded-full flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <p className="text-canton-green font-semibold">All Regulatory Requirements Satisfied</p>
          <p className="text-canton-muted text-sm mt-0.5">
            6 regulations covered • Enforced at ledger layer • Not application layer
          </p>
        </div>
      </div>

      {/* Compliance table */}
      <div className="bg-canton-card border border-canton-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-canton-border bg-canton-darker">
          <div className="col-span-3 text-canton-muted text-xs uppercase tracking-wide">Contract</div>
          <div className="col-span-2 text-canton-muted text-xs uppercase tracking-wide">Regulation</div>
          <div className="col-span-3 text-canton-muted text-xs uppercase tracking-wide">Requirement</div>
          <div className="col-span-3 text-canton-muted text-xs uppercase tracking-wide">How it's enforced</div>
          <div className="col-span-1 text-canton-muted text-xs uppercase tracking-wide">Status</div>
        </div>

        {complianceData.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-canton-border last:border-0 hover:bg-canton-darker transition-colors"
          >
            <div className="col-span-3">
              <span className="text-canton-accent text-sm font-mono">{row.contract}</span>
            </div>
            <div className="col-span-2">
              <span className="text-canton-text text-sm font-medium">{row.regulation}</span>
            </div>
            <div className="col-span-3">
              <span className="text-canton-muted text-sm">{row.requirement}</span>
            </div>
            <div className="col-span-3">
              <span className="text-canton-muted text-sm">{row.description}</span>
            </div>
            <div className="col-span-1 flex items-center">
              <CheckCircle size={16} className="text-canton-green" />
            </div>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div className="bg-canton-card border border-canton-border rounded-xl p-5">
        <p className="text-canton-muted text-sm leading-relaxed">
          <span className="text-canton-text font-semibold">Key architectural insight: </span>
          These requirements are enforced at the <span className="text-canton-accent">contract layer</span>, 
          not the application layer. A ComplianceOfficer signature is required by the ledger itself — 
          no application code can bypass it. An audit trail cannot be deleted because the contracts 
          have no delete choice by design.
        </p>
      </div>
    </div>
  );
}