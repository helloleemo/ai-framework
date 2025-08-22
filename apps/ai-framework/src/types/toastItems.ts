import { JSX } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export interface ToastStyles {
  info: {
    status: string;
    backgroundColor: string;
    textColor: string;
    icon: JSX.Element;
  };
  warning: {
    status: string;
    backgroundColor: string;
    textColor: string;
    icon: JSX.Element;
  };
  error: {
    status: string;
    backgroundColor: string;
    textColor: string;
    icon: JSX.Element;
  };
}

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

export interface ToastGroupProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}
