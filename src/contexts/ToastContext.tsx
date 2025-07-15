import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from '../components/Toast'; // Import the Toast component

// 1. Define ToastState interface (moved from App.tsx)
interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number; // Unique ID for each toast to ensure re-render
}

// 2. Define ToastContextType interface
interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// 3. Create the ToastContext
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 4. Create the ToastProvider component
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<ToastState | null>(null);

  // useCallback to memoize showToast and prevent unnecessary re-renders of consuming components
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setCurrentToast({ message, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => {
    setCurrentToast(null);
  }, []);

  const contextValue: ToastContextType = {
    showToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* The Toast component itself is rendered within the provider */}
      {currentToast && (
        <Toast
          key={currentToast.id} // Key ensures React re-mounts/re-animates on message change
          message={currentToast.message}
          type={currentToast.type}
          onClose={clearToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// 5. Custom hook to easily consume the ToastContext
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};