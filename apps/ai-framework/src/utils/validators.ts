export const validateField = (
  field: 'email' | 'password',
  value: string
): string | undefined => {
  if (field === 'email') {
    if (!value || value.trim() === '' || !/\S+@\S+\.\S+/.test(value)) {
      return 'email address';
    }
  }

  if (field === 'password') {
    if (!value || value.trim() === '' || value.length < 5) {
      return 'password';
    }
  }

  return undefined;
};
