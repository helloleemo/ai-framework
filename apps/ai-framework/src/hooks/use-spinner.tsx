import { useState } from 'react';

export function useSpinner() {
  const [loading, setLoading] = useState<boolean>(false);

  const Spinner = (
    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  );

  return { loading, setLoading, Spinner };
}
