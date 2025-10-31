type JwtPayload = { sub?: number | string; email?: string; isAdmin?: boolean; exp?: number } | null;

function safeBase64Decode(str: string) {
  try {
    // Replace URL-safe characters
    const s = str.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '='
    const pad = s.length % 4;
    const padded = pad ? s + '='.repeat(4 - pad) : s;
    return atob(padded);
  } catch (e) {
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

export function decodeJwtPayload(token?: string): JwtPayload {
  try {
    const t = token ?? getAccessToken();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length < 2) return null;
    const decoded = safeBase64Decode(parts[1]);
    if (!decoded) return null;
    return JSON.parse(decoded) as JwtPayload;
  } catch (e) {
    return null;
  }
}

export function tokenIsExpired(token?: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  // exp is in seconds
  return Date.now() / 1000 >= payload.exp;
}

export function tokenIsAdmin(token?: string): boolean {
  const payload = decodeJwtPayload(token);
  return !!payload?.isAdmin;
}
