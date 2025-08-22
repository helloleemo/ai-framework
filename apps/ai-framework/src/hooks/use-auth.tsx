import { decodeTokenAPI, refreshTokenAPI } from '@/api/auth';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface TokenInfo {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  displayName: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: string;
  iss: string;
  aud: string;
}

export function useAuthGuard() {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<TokenInfo | null>(null);

  const clearTokens = useCallback(() => {
    localStorage.removeItem('code');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate('/');
  }, [navigate]);

  const storeLoginData = useCallback(
    (loginData: {
      code: string;
      accessToken: string;
      refreshToken: string;
      userName: string;
    }) => {
      localStorage.setItem('code', loginData.code);
      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('refreshToken', loginData.refreshToken);
      localStorage.setItem('userName', loginData.userName);

      checkAuth();
    },
    [],
  );

  const getCurrentTokens = () => {
    const code = localStorage.getItem('code');
    const accessToken = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const userName = localStorage.getItem('userName');
    return { code, accessToken, refresh, userName };
  };

  const decodeToken = async (token: string): Promise<TokenInfo | null> => {
    try {
      const res = await decodeTokenAPI(token);
      if (res.success && res.data) {
        return res.data.tokenInfo as TokenInfo;
      }
      return null;
    } catch (error) {
      console.error('Decode token failed:', error);
      return null;
    }
  };

  const refreshTokens = async () => {
    const { code, accessToken, refresh } = getCurrentTokens();

    if (!code || !accessToken || !refresh) {
      return false;
    }

    try {
      const res = await refreshTokenAPI(code, accessToken, refresh);
      if (res.success && res.data) {
        localStorage.setItem('code', res.data.code);
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  };

  const extractUserInfo = (tokenInfo: TokenInfo) => {
    const storedUserName = localStorage.getItem('userName');

    return {
      username:
        tokenInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      userId:
        tokenInfo[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ],
      displayName: tokenInfo.displayName,
      email:
        tokenInfo[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
        ],
      role: tokenInfo[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
      exp: tokenInfo.exp,
      iss: tokenInfo.iss,
      aud: tokenInfo.aud,
      userName: storedUserName,
    };
  };

  const isTokenExpired = (expString: string) => {
    const expirationTime = Number(expString) * 1000;
    const currentTime = Date.now();
    return currentTime > expirationTime;
  };

  const isTokenExpiringSoon = (expString: string) => {
    const expirationTime = Number(expString) * 1000;
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return expirationTime - currentTime < fiveMinutes;
  };

  const checkAuth = useCallback(async () => {
    setIsAuthChecking(true);

    const { accessToken } = getCurrentTokens();

    if (!accessToken) {
      clearTokens();
      setIsAuthChecking(false);
      return;
    }

    try {
      const tokenInfo = await decodeToken(accessToken);

      if (!tokenInfo || !tokenInfo.exp) {
        clearTokens();
        setIsAuthChecking(false);
        return;
      }

      if (isTokenExpired(tokenInfo.exp)) {
        console.log('Token expired, attempting refresh...');
        const refreshSuccess = await refreshTokens();
        if (!refreshSuccess) {
          clearTokens();
          setIsAuthChecking(false);
          return;
        }

        const { accessToken: newAccessToken } = getCurrentTokens();
        if (newAccessToken) {
          const newTokenInfo = await decodeToken(newAccessToken);
          if (newTokenInfo) {
            setUserInfo(newTokenInfo);
          }
        }
      } else if (isTokenExpiringSoon(tokenInfo.exp)) {
        console.log('Token expiring soon, refreshing...');
        refreshTokens().catch(console.error);
        setUserInfo(tokenInfo);
      } else {
        setUserInfo(tokenInfo);
      }

      setIsAuthenticated(true);
      setIsAuthChecking(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      clearTokens();
      setIsAuthChecking(false);
    }
  }, [clearTokens]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const recheckAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  const getUserInfo = useCallback(() => {
    return userInfo ? extractUserInfo(userInfo) : null;
  }, [userInfo]);

  return {
    isAuthChecking,
    isAuthenticated,
    userInfo: getUserInfo(),
    clearTokens,
    storeLoginData,
    recheckAuth,
    getCurrentTokens,
  };
}
