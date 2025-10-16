import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// PUBLIC_INTERFACE
export function useAuth() {
  /** Accessor for AuthContext. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
