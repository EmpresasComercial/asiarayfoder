import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fycskldchqqqohgvioal.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Y3NrbGRjaHFxcW9oZ3Zpb2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MDQxOTMsImV4cCI6MjA4MjQ4MDE5M30.vC5GkVPi9mZwkSNQG_ajVcRnWN8pyYGD0xQbl8Uhco0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const GATEWAY_URL = `${SUPABASE_URL}/functions/v1/gateway`;

/**
 * Helper: Returns the current access token from the Supabase session.
 */
export const getAccessToken = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};

export const gatewayCall = async (op: number, payload: any = {}) => {
  const token = await getAccessToken();
  if (!token) throw new Error('Sessão inválida');

  const resp = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ op, data: payload })
  });

  const data = await resp.json();
  
  if (resp.status === 401 && data.force_logout) {
    await supabase.auth.signOut();
    window.dispatchEvent(new Event('force-logout'));
    throw new Error('SESSION_EXPIRED');
  }

  if (!resp.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
};
