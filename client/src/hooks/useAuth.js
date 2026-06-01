import { useState } from 'react';
import { api } from '../lib/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/v1/satusehat/token');
      return response;
    } catch (err) {
      setError(err.message || 'Login gagal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
  };
}
