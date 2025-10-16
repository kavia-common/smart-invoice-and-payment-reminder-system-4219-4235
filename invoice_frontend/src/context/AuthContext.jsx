import { createContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authentication state and actions across the app.
   * Stores token and user (decoded) in localStorage under 'auth'.
   */
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // initialize from storage
  useEffect(() => {
    const raw = localStorage.getItem('auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setToken(parsed.token);
          const decoded = safeDecode(parsed.token);
          setUser(decoded || null);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const isAuthenticated = !!token;

  const login = (jwt) => {
    setToken(jwt);
    const decoded = safeDecode(jwt);
    setUser(decoded || null);
    localStorage.setItem('auth', JSON.stringify({ token: jwt, user: decoded || null }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth');
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function safeDecode(t) {
  try {
    return jwtDecode(t);
  } catch {
    return null;
  }
}
