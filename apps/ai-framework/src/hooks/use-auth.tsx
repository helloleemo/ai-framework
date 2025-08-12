import { decodeTokenAPI, refreshTokenAPI } from '@/api/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuthGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/');
      return;
    }

    // decode tooken for getting expiration
    decodeTokenAPI(accessToken)
      .then((res) => {
        const tokenInfo = res.data?.tokenInfo;
        const expStr = tokenInfo?.exp;
        if (!res.success || !tokenInfo || !expStr) {
          localStorage.removeItem('code');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/');
          return;
        }
        const expirationTime = Number(expStr) * 1000;
        const currentTime = Date.now();

        // <5 mins -> refresh token
        if (expirationTime - currentTime < 5 * 60 * 1000) {
          const code = localStorage.getItem('code');
          const refresh = localStorage.getItem('refreshToken');

          if (code && refresh) {
            refreshTokenAPI(code, accessToken, refresh)
              .then((res) => {
                if (res.success) {
                  if (res.data) {
                    localStorage.setItem('code', res.data.code);
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('refreshToken', res.data.refreshToken);
                  } else {
                    localStorage.removeItem('code');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/');
                  }
                } else {
                  localStorage.removeItem('code');
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  navigate('/');
                }
              })
              .catch(() => {
                localStorage.removeItem('code');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/');
              });
          } else {
            localStorage.removeItem('code');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
          }
        }

        // expiration -> logout
        if (currentTime > expirationTime) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/');
        }
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
      });
  }, [navigate]);
}
