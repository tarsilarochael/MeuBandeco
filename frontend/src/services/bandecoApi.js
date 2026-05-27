/**
 * Cliente HTTP para o backend Flask (/api/app).
 * Base URL: VITE_API_URL no .env ou http://localhost:5000/api/app
 */
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/app').replace(
  /\/$/,
  ''
);

export const PAPEL_NUTRICIONISTA = 101;

const LS_TOKEN = 'meu-bandeco-token';
const LS_USER = 'meu-bandeco-user';

export function getStoredToken() {
  return localStorage.getItem(LS_TOKEN);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function persistAuth(token, user) {
  localStorage.setItem(LS_TOKEN, token);
  localStorage.setItem(LS_USER, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
}

function erroApi(data) {
  if (Array.isArray(data?.mensagem)) return data.mensagem.join(' ');
  if (typeof data?.mensagem === 'string') return data.mensagem;
  return 'Não foi possível completar a operação.';
}

export async function fetchSessaoComToken(token) {
  const res = await fetch(`${API_BASE}/loginAcessoUsuario`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.nomUsuario) {
    throw new Error(erroApi(data));
  }
  return {
    codUsuarioCPF: data.codUsuarioCPF,
    nomUsuario: data.nomUsuario,
    idPapel: Number(data.idPapel),
  };
}

export async function loginPorCpfESenha(codUsuarioCPF, desSenha) {
  const res = await fetch(`${API_BASE}/obterToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codUsuarioCPF, desSenha }),
  });
  const data = await res.json().catch(() => ({}));

  if (!data.token) {
    throw new Error(erroApi(data));
  }

  const user = await fetchSessaoComToken(data.token);
  return { token: data.token, user };
}
