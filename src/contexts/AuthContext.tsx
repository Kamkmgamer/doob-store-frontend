// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Spinner from '../components/Spinner'; // Make sure this path is correct
import { useToast } from '../contexts/ToastContext'; // <--- ADD THIS LINE

// Define the shape of the user object that comes from your backend
interface User {
  id: string;
  username: string;
  email?: string; // Add email as optional, or required if your backend always returns it
  role?: string// Add any other user properties your backend returns
}

// Define the shape of the AuthContext value
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, email: string) => Promise<boolean>; // Email added here
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // <--- ADD THIS LINE TO GET showToast FROM ITS CONTEXT
  const { showToast } = useToast();

  const API_BASE_URL = 'http://localhost:3000'; // Your backend API base URL

  const saveAuthData = (accessToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = useCallback(async () => {
    setLoadingAuth(true);
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const verifiedUser: User = data.user || data;

          if (verifiedUser && verifiedUser.id === parsedUser.id) {
            setToken(storedToken);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            console.warn("Auth token validation failed: User mismatch or verification issue.");
            clearAuthData();
          }
        } else {
          console.warn("Auth token validation failed:", response.status, response.statusText);
          clearAuthData();
        }
      } catch (error) {
        console.error("Error parsing stored user or validating token:", error);
        clearAuthData();
      }
    } else {
      clearAuthData();
    }
    setLoadingAuth(false);
  }, [API_BASE_URL]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Update dependencies with showToast
  const login = useCallback(async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { accessToken, user } = data;
        saveAuthData(accessToken, user);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message || response.statusText);
        // Display specific error message if backend provides it as an array or string
        const errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : (errorData.message || response.statusText);
        showToast(`Login failed: ${errorMessage}`, 'error'); // This will now work
        clearAuthData();
        return false;
      }
    } catch (error: any) {
      console.error('Network error during login:', error);
      showToast(`Network error during login: ${error.message}`, 'error');
      clearAuthData();
      return false;
    }
  }, [API_BASE_URL, showToast]); // <--- ADDED showToast TO DEPENDENCY ARRAY

  // Updated signup function to accept email
  const signup = useCallback(async (username, password, email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        const data = await response.json();
        const { accessToken, user } = data;
        saveAuthData(accessToken, user);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Signup failed:', errorData.message || response.statusText);
        // Display specific error message if backend provides it as an array or string
        const errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : (errorData.message || response.statusText);
        showToast(`Signup failed: ${errorMessage}`, 'error'); // This will now work
        clearAuthData();
        return false;
      }
    } catch (error: any) {
      console.error('Network error during signup:', error);
      showToast(`Network error during signup: ${error.message}`, 'error');
      clearAuthData();
      return false;
    }
  }, [API_BASE_URL, showToast]); // <--- ADDED showToast TO DEPENDENCY ARRAY

  const logout = useCallback(() => {
    clearAuthData();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
        <p className="ml-4 text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};