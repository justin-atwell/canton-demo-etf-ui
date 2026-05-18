import axios from 'axios';
import type {
  CollateralAccount,
  CollateralLock,
  MarginCall,
  CreateCollateralAccountRequest,
  LockCollateralRequest,
  IssueMarginCallRequest,
  CollateralTransactionRequest,
} from '../types';

const BASE = 'http://localhost:8080';

// -------------------------------------------------------------------------
// Reads
// -------------------------------------------------------------------------

export async function getAccounts(authHeader: string): Promise<CollateralAccount[]> {
  const { data } = await axios.get(`${BASE}/collateral`, {
    headers: { Authorization: authHeader },
  });
  return data;
}

export async function getLocks(authHeader: string): Promise<CollateralLock[]> {
  const { data } = await axios.get(`${BASE}/collateral/locks`, {
    headers: { Authorization: authHeader },
  });
  return data;
}

export async function getMarginCalls(authHeader: string): Promise<MarginCall[]> {
  const { data } = await axios.get(`${BASE}/collateral/margincalls`, {
    headers: { Authorization: authHeader },
  });
  return data;
}

// -------------------------------------------------------------------------
// Account
// -------------------------------------------------------------------------

export async function createAccount(
  authHeader: string,
  req: CreateCollateralAccountRequest
): Promise<string> {
  const { data } = await axios.post(`${BASE}/collateral`, req, {
    headers: { Authorization: authHeader },
  });
  return data;
}

// -------------------------------------------------------------------------
// Deposit / Withdraw
// -------------------------------------------------------------------------

export async function deposit(
  authHeader: string,
  accountId: string,
  req: CollateralTransactionRequest
): Promise<void> {
  await axios.post(`${BASE}/collateral/${accountId}/deposit`, req, {
    headers: { Authorization: authHeader },
  });
}

export async function withdraw(
  authHeader: string,
  accountId: string,
  req: CollateralTransactionRequest
): Promise<void> {
  await axios.post(`${BASE}/collateral/${accountId}/withdraw`, req, {
    headers: { Authorization: authHeader },
  });
}

// -------------------------------------------------------------------------
// Lock
// -------------------------------------------------------------------------

export async function lockCollateral(
  authHeader: string,
  accountId: string,
  req: LockCollateralRequest
): Promise<void> {
  await axios.post(`${BASE}/collateral/${accountId}/lock`, req, {
    headers: { Authorization: authHeader },
  });
}

// -------------------------------------------------------------------------
// Margin Calls
// -------------------------------------------------------------------------

export async function issueMarginCall(
  authHeader: string,
  accountId: string,
  req: IssueMarginCallRequest
): Promise<void> {
  await axios.post(`${BASE}/collateral/${accountId}/margincall`, req, {
    headers: { Authorization: authHeader },
  });
}

export async function meetMarginCall(
  authHeader: string,
  accountId: string,
  callId: string
): Promise<void> {
  await axios.put(`${BASE}/collateral/${accountId}/margincall/${callId}/meet`, {}, {
    headers: { Authorization: authHeader },
  });
}

export async function defaultMarginCall(
  authHeader: string,
  accountId: string,
  callId: string
): Promise<void> {
  await axios.put(`${BASE}/collateral/${accountId}/margincall/${callId}/default`, {}, {
    headers: { Authorization: authHeader },
  });
}