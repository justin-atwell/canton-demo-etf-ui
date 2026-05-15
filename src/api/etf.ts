import axios from 'axios';
import type { EtfDetail, NavDataPoint, ProposeRebalanceRequest, ProposeRebalanceResponse } from '../types';

const BASE = 'http://localhost:8080';

export async function getEtf(ticker: string, partyId: string): Promise<EtfDetail> {
  const { data } = await axios.get(`${BASE}/api/etf/${ticker}`, { params: { partyId } });
  return data;
}

export async function getNavHistory(ticker: string, partyId: string, limit = 60): Promise<NavDataPoint[]> {
  const { data } = await axios.get(`${BASE}/api/nav/${ticker}/history`, { params: { partyId, limit } });
  return data;
}

export async function proposeRebalance(
  ticker: string,
  req: ProposeRebalanceRequest
): Promise<ProposeRebalanceResponse> {
  const { data } = await axios.post(`${BASE}/api/rebalance/${ticker}/propose`, req);
  return data;
}