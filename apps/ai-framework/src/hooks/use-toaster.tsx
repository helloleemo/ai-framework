import toast from 'react-hot-toast';

export function useToaster() {
  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#713200',
      },
      iconTheme: {
        primary: '#713200',
        secondary: '#FFFAEE',
      },
    });
  };
  const showError = (message: string) => {
    toast.error(message, {
      style: {
        border: '1px solid #dc2626',
        padding: '16px',
        color: '#dc2626',
      },
      iconTheme: {
        primary: '#dc2626',
        secondary: '#fef2f2',
      },
    });
  };
  return { showSuccess, showError };
}
