import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load from session storage on mount
    const storedToken = sessionStorage.getItem('authToken');
    const storedUser = sessionStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('[v0] Attempting login for:', email);
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Login failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.token || !data.user) {
          throw new Error('Invalid login response format');
        }

        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('authUser', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        console.log('[v0] Login successful for user:', data.user.email);
        resolve(data);
      } catch (error) {
        console.error('[v0] Login error:', error instanceof Error ? error.message : String(error));
        reject(error);
      }
    });
  };

  const signup = async (email, password, confirmPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('[v0] Attempting signup for:', email);

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, confirmPassword }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Signup failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.token || !data.user) {
          throw new Error('Invalid signup response format');
        }

        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('authUser', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);

        console.log('[v0] Signup successful for user:', data.user.email);
        resolve(data);
      } catch (error) {
        console.error('[v0] Signup error:', error instanceof Error ? error.message : String(error));
        reject(error);
      }
    });
  };

  const logout = () => {
    try {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
      console.log('[v0] User logged out');
    } catch (error) {
      console.error('[v0] Logout error:', error instanceof Error ? error.message : String(error));
    }
  };

  return {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
