"use client"
import { validateCustomerToken } from 'lib/shopify';
import { Customer } from 'lib/shopify/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token: string) => {
    // Save token to localStorage
    localStorage.setItem('customer_token', token);
    // Fetch customer data using the token
    await checkAuth();
    toast.success('Logged in successfully');
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('customer_token');
    // Clear customer data immediately
    setCustomer(null);
    toast.success('Logged out successfully');
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('customer_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Validate token with Shopify
      const customerData = await validateCustomerToken(token);
      
      if (customerData) {
        setCustomer(customerData);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('customer_token');
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // On error, clear token and customer data
      localStorage.removeItem('customer_token');
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []); // Only run on mount

  const value: AuthContextType = {
    customer,
    isLoading,
    isAuthenticated: !!customer,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
