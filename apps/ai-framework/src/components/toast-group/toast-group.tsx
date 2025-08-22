import { useState, useCallback } from 'react';
import Toast from './toast';
import { generateUUID } from '@/utils/uuid';
import { ToastData, ToastGroupProps } from '@/types/toastItems';

export function ToastGroup({ toasts, onRemoveToast }: ToastGroupProps) {
  return (
    <div className="max-w-[calc(100vw-1rem) fixed top-4 right-4 z-50 space-y-2 overflow-x-hidden">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
}

export function useToastGroup() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = generateUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string) => addToast({ type: 'success', message }),
    [addToast],
  );

  const showError = useCallback(
    (message: string) =>
      addToast({ type: 'error', message, autoClose: true, duration: 2000 }),
    [addToast],
  );

  const showWarning = useCallback(
    (message: string) =>
      addToast({ type: 'warning', message, autoClose: true, duration: 2000 }),
    [addToast],
  );

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
  };
}
