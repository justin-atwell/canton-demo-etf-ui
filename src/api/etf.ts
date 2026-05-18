import axios from 'axios';
import type {
  EtfDetail,
  NavDataPoint,
  ProposeRebalanceRequest,
  RebalanceProposal,
} from '../types';

const BASE = 'http://localhost:8080';

// -------------------------------------------------------------------------
// ETF
// -------------------------------------------------------------------------

export async function createEtf(
  authHeader: string,
  req: {
    ticker: string;
    name: string;
    cusip: string;
    custodian: string;
    compliance: string;
    auditor: string;
  }
): Promise<string> {
  const { data } = await axios.post(`${BASE}/etf`, req, {
    headers: { Authorization: authHeader },
  });
  return data;
}

export async function getEtf(
  authHeader: string,
  ticker: string
): Promise<EtfDetail> {
  const { data } = await axios.get(`${BASE}/etf/${ticker}`, {
    headers: { Authorization: authHeader },
  });
  return data;
}

export async function suspendEtf(
  authHeader: string,
  ticker: string
): Promise<void> {
  await axios.put(`${BASE}/etf/${ticker}/suspend`, {}, {
    headers: { Authorization: authHeader },
  });
}

// -------------------------------------------------------------------------
// NAV
// -------------------------------------------------------------------------

export async function getNavHistory(
  authHeader: string,
  ticker: string
): Promise<NavDataPoint[]> {
  const { data } = await axios.get(`${BASE}/etf/${ticker}/nav/history`, {
    headers: { Authorization: authHeader },
  });
  return data;
}
export async function getProposals(
  authHeader: string,
  ticker: string
): Promise<RebalanceProposal[]> {
  const { data } = await axios.get(`${BASE}/etf/${ticker}/rebalance`, {
    headers: { Authorization: authHeader },
  });
  return data.map((p: any) => ({
    ...p,
    newWeights: p.newWeights.map((w: any) => ({
      symbol: w._1,
      weight: w._2,
    })),
  }));
}


// -------------------------------------------------------------------------
// Rebalance
// -------------------------------------------------------------------------

export async function proposeRebalance(
  authHeader: string,
  ticker: string,
  req: ProposeRebalanceRequest
): Promise<string> {
  const { data } = await axios.post(`${BASE}/etf/${ticker}/rebalance`, req, {
    headers: { Authorization: authHeader },
  });
  return data;
}

export async function getProposal(
  authHeader: string,
  ticker: string,
  proposalId: string
): Promise<RebalanceProposal> {
  const { data } = await axios.get(`${BASE}/etf/${ticker}/rebalance/${proposalId}`, {
    headers: { Authorization: authHeader },
  });
  return {
    ...data,
    newWeights: data.newWeights.map((w: any) => ({
      symbol: w._1,
      weight: w._2,
    })),
  };
}

export async function approveProposal(
  authHeader: string,
  ticker: string,
  proposalId: string
): Promise<void> {
  await axios.put(`${BASE}/etf/${ticker}/rebalance/${proposalId}/approve`, {}, {
    headers: { Authorization: authHeader },
  });
}

export async function rejectProposal(
  authHeader: string,
  ticker: string,
  proposalId: string
): Promise<void> {
  await axios.put(`${BASE}/etf/${ticker}/rebalance/${proposalId}/reject`, {}, {
    headers: { Authorization: authHeader },
  });
}

export async function executeProposal(
  authHeader: string,
  ticker: string,
  proposalId: string
): Promise<void> {
  await axios.put(`${BASE}/etf/${ticker}/rebalance/${proposalId}/execute`, {}, {
    headers: { Authorization: authHeader },
  });
}