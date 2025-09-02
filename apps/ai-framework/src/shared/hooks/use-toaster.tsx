import toast from 'react-hot-toast';

export function useToaster() {
  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        padding: '16px',
        color: '#166534',
      },
      iconTheme: {
        primary: '#166534',
        secondary: '#dcfce7',
      },
    });
  };
  const showError = (message: string) => {
    toast.error(message, {
      style: {
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
