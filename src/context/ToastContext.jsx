import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center p-4 rounded-md shadow-lg min-w-[250px] max-w-sm transition-all transform duration-300 ease-in-out ${
              toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              toast.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
            role="alert"
          >
            <div className="mr-3 flex-shrink-0">
              {toast.type === 'success' && <FiCheckCircle className="w-5 h-5 text-green-500" />}
              {toast.type === 'error' && <FiAlertCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'warning' && <FiAlertCircle className="w-5 h-5 text-yellow-500" />}
              {toast.type === 'info' && <FiInfo className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 text-sm font-medium mr-2">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-auto p-1 rounded-md inline-flex text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-label="Close"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
