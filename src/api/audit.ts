import axios from 'axios';
import type { AccessEvent } from '../types';

const BASE = 'http://localhost:8080';

export async function getAccessEvents(authHeader: string): Promise<AccessEvent[]> {
  const { data } = await axios.get(`${BASE}/audit`, {
    headers: { Authorization: authHeader },
  });
  return data;
}