The API layer speaks gRPC to a Canton Network participant node via the Daml Java bindings
(`com.daml:bindings-java:3.4.11`). Every REST call that mutates state submits a ledger
command. Every read queries active contracts filtered by party.

---

## Daml Contract Inventory

**IAM Layer** — LDAP-style identity expressed as first-class ledger objects
- `DirectoryEntry` — Canton party ↔ LDAP DN mapping
- `RoleMembership` — Cryptographic role grant (not a DB row — a signed contract)
- `AccessEvent` — Immutable audit record for every privileged action

**Fund Layer**
- `ETFDefinition` — The fund itself. Signatories: FundManager + Custodian + Compliance
- `Constituent` — Individual holding with target weight
- `CapTable` — Ownership distribution
- `NAV` — Immutable daily NAV record. No choices — append only.

**Collateral Layer**
- `CollateralAccount` — Custodian-controlled asset account
- `CollateralLock` — Encumbers a specific amount for a specific reason
- `CollateralRelease` — Unlocks previously locked collateral
- `HaircutSchedule` — Risk-adjusted collateral valuation
- `MarginCall` — Issued by Custodian, met or defaulted by FundManager
- `LiquidationOrder` — Triggered on MarginCall default

**Rebalance Layer**
- `RebalanceProposal` — Proposed by FundManager, requires Compliance approval
- `ConstituentApproval` — Per-constituent sign-off
- `RebalanceExecution` — Final execution record post-approval

**Market Data**
- `NBBOQuote` — National Best Bid/Offer posted by MarketMaker via QuickFIX/J

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

The UI runs fully on mock data when the API is unavailable.
Swap roles in the top bar to explore role-based access across all pages.

To connect to the live API:
```bash
# API must be running on localhost:8080
# See canton-demo-etf-api for setup
```

---

## Canton Network

This platform runs on [Canton Network](https://www.canton.network/) — the interoperable
blockchain network built on the Daml smart contract language. Canton's privacy model means
each party only sees the contracts they are a signatory or observer on. The compliance
workflows in this platform aren't just UI items, they're enforced at the ledger level.

DevNet access is sponsored by the Canton Foundation.

---

## About

Built by **Justin Atwell** — Principal Solutions Architect with 15 years across
institutional capital markets infrastructure (Edward Jones, Bridgewater Associates)
and enterprise DLT deployments (Hedera Hashgraph / Avery Dennison atma.io).

This platform is part of a five-part LinkedIn series on tokenized asset infrastructure:

- ✅ **Part 1** — Why LDAP Breaks for Tokenized Assets
- ✅ **Part 2** — IAM as a Ledger Object: RoleMembership as Cryptographic Grant
- 🔜 **Part 3** — Collateral On-Chain: Margin Calls Without Middleware
- 🔜 **Part 4** — Rebalancing with Regulatory Teeth: SEC 38a-1 in Daml
- 🔜 **Part 5** — It's Live: Here's the URL

Follow along: [linkedin.com/in/justin-atwell](https://linkedin.com/in/justin-atwell)

---

*This is not related to Canton the company. Canton ETF Platform is a demonstration system. Not financial advice. Not investment advice.
Not legal advice. Just good architecture.*