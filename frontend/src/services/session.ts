export type StoredSession = {
  token: string | null;
  refreshToken: string | null;
  user: any | null;
  userId: number | null;
};

function normalizeUserId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

export function extractUserId(user: any): number | null {
  if (!user) return null;
  const candidate = (user as any).id ?? (user as any).userId ?? (user as any).user_id;
  return normalizeUserId(candidate);
}

export function persistSession(token?: string | null, user?: any, refreshToken?: string | null) {
  if (token) {
    localStorage.setItem('authToken', token);
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    const userId = extractUserId(user);
    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
  }
}

export function loadStoredSession(): StoredSession {
  const token = localStorage.getItem('authToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const rawUser = localStorage.getItem('user');

  let user: any = null;
  let userId: number | null = null;

  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
      userId = extractUserId(user);
    } catch (err) {
      console.warn('Impossibile leggere l\'utente da localStorage:', err);
      user = null;
    }
  }

  if (!userId) {
    const storedUserId = localStorage.getItem('userId');
    userId = storedUserId ? normalizeUserId(storedUserId) : null;
  }

  return { token, refreshToken, user, userId };
}

export function clearSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
}
