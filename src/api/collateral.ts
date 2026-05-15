import axios from 'axios';
import type {
  CollateralAccount,
  CollateralLock,
  MarginCall,
  CreateCollateralAccountRequest,
  LockCollateralRequest,
  IssueMarginCallRequest,
} from '../types';

const BASE = 'http://localhost:8080';

export async function getAccounts(partyId: string): Promise<CollateralAccount[]> {
  const { data } = await axios.get(`${BASE}/api/collateral/accounts`, { params: { partyId } });
  return data;
}

export async function getLocks(partyId: string): Promise<CollateralLock[]> {
  const { data } = await axios.get(`${BASE}/api/collateral/locks`, { params: { partyId } });
  return data;
}

export async function getMarginCalls(partyId: string): Promise<MarginCall[]> {
  const { data } = await axios.get(`${BASE}/api/collateral/margin-calls`, { params: { partyId } });
  return data;
}

export async function createAccount(req: CreateCollateralAccountRequest): Promise<CollateralAccount> {
  const { data } = await axios.post(`${BASE}/api/collateral/accounts`, req);
  return data;
}

export async function lockCollateral(req: LockCollateralRequest): Promise<CollateralLock> {
  const { data } = await axios.post(`${BASE}/api/collateral/lock`, req);
  return data;
}

export async function issueMarginCall(req: IssueMarginCallRequest): Promise<MarginCall> {
  const { data } = await axios.post(`${BASE}/api/collateral/margin-call`, req);
  return data;
}