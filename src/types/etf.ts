export interface Constituent {
  contractId: string;
  ticker: string;
  name: string;
  cusip: string;
  targetWeight: number;
  currentWeight: number;
  lastPrice: number;
  priceChange24h: number;
}

export interface EtfDetail {
  contractId: string;
  ticker: string;
  name: string;
  cusip: string;
  status: 'Active' | 'Suspended';
  fundManager: string;
  inceptionDate: string;
  navPerShare: number;
  totalAUM: number;
  constituents: Constituent[];
}

export interface NavDataPoint {
  date: string;
  navPerShare: number;
  totalAUM: number;
}

export interface ProposeRebalanceRequest {
  partyId: string;
  newWeights: Record<string, number>; // contractId → weight
}

export interface ProposeRebalanceResponse {
  proposalId: string;
}