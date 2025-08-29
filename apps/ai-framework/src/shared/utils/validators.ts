export const validateField = (
  field: 'userName' | 'password',
  value: string
): string | undefined => {
  if (field === 'userName') {
    if (!value || value.trim() === '') {
      return 'user name';
    }
  }

  if (field === 'password') {
    if (!value || value.trim() === '' || value.length < 5) {
      return 'password';
    }
  }

  return undefined;
};
