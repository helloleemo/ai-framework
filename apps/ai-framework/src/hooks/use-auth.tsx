import { decodeTokenAPI, refreshTokenAPI } from '@/api/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthGuard() {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const clearTokens = () => {
    localStorage.removeItem('code');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const refreshWithRetry = async (
    code: string,
    accessToken: string,
    refresh: string,
    retries = 2,
  ) => {
    try {
      const res = await refreshTokenAPI(code, accessToken, refresh);
      if (res.success && res.data) {
        localStorage.setItem('code', res.data.code);
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      if (retries > 0) {
        return refreshWithRetry(code, accessToken, refresh, retries - 1);
      }
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthChecking(true);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        clearTokens();
        setIsAuthChecking(false);
        return;
      }

      try {
        // decode token for getting expiration
        const res = await decodeTokenAPI(accessToken);
        const tokenInfo = res.data?.tokenInfo;
        const expStr = tokenInfo?.exp;

        if (!res.success || !tokenInfo || !expStr) {
          clearTokens();
          setIsAuthChecking(false);
          return;
        }

        const expirationTime = Number(expStr) * 1000;
        const currentTime = Date.now();
        const code = localStorage.getItem('code');
        const refresh = localStorage.getItem('refreshToken');

        // expired, try to refresh
        if (currentTime > expirationTime) {
          if (code && refresh) {
            const refreshSuccess = await refreshWithRetry(
              code,
              accessToken,
              refresh,
            );
            if (!refreshSuccess) {
              clearTokens();
              setIsAuthChecking(false);
              return;
            }
          } else {
            clearTokens();
            setIsAuthChecking(false);
            return;
          }
        }
        // almost expired
        else if (expirationTime - currentTime < 5 * 60 * 1000) {
          if (code && refresh) {
            await refreshWithRetry(code, accessToken, refresh);
          }
        }

        setIsAuthChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        clearTokens();
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return { isAuthChecking };
}
