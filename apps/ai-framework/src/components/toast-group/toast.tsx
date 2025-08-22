import { ToastStyles, ToastProps } from '@/types/toastItems';
import { SuccessIcon } from '../icon/success-icon';
import { useEffect, useState } from 'react';
import { CloseIcon } from '../icon/close-icon';

const styles = {
  success: 'bg-green-100/90 text-green-600 border-green-200 ',
  error: 'bg-red-100/90 text-red-600 border-red-200 ',
  warning: 'bg-yellow-100/90 text-yellow-600 border-yellow-200 ',
};

export default function Toast({
  id,
  type,
  message,
  onClose,
  autoClose = true,
  duration = 3000,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose(id);
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, id, onClose]);

  return (
    <div
      className={`w-80 rounded-sm border p-4 shadow-lg ${styles[type]} transition-all duration-300 ease-in-out ${show ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'} `}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => setShow(false)}
          className="cursor-pointer rounded-full p-1 hover:bg-black/10"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
