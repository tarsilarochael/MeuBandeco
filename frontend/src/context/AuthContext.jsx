import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  PAPEL_NUTRICIONISTA,
  clearAuth,
  fetchSessaoComToken,
  getStoredToken,
  loginPorCpfESenha,
  persistAuth,
} from '../services/bandecoApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;

    async function hydrate() {
      const token = getStoredToken();
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const u = await fetchSessaoComToken(token);
        if (!cancel) setUser(u);
      } catch {
        clearAuth();
        if (!cancel) setUser(null);
      } finally {
        if (!cancel) setReady(true);
      }
    }

    hydrate();
    return () => {
      cancel = true;
    };
  }, []);

  const login = useCallback(async (codUsuarioCPF, desSenha) => {
    const { token, user: nextUser } = await loginPorCpfESenha(codUsuarioCPF, desSenha);
    persistAuth(token, nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      logout,
      isNutricionista: user?.idPapel === PAPEL_NUTRICIONISTA,
    }),
    [user, ready, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

export { PAPEL_NUTRICIONISTA };
