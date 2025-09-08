// import { decodeTokenAPI, refreshTokenAPI } from '../api/auth';
// import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenAPI, refreshTokenAPI } from '../api/auth';
import { useEffect, useState } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export function useAuthGuard() {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    const clientId = 'data-pipeline-ui';
    const redirectUri = encodeURIComponent('http://localhost:3000/callback');
    const responseType = 'code';
    const scope = encodeURIComponent(
      'openid profile api-client offline_access',
    );
    const state = 'test123';
    const nonce = 'test456';
    const codeChallenge = '8o_zJbxUWekgG0_yXlZot7P-pJNfJz6IV_Z1pL90SWg';
    const codeChallengeMethod = 'S256';

    const authUrl = `http://192.168.0.103:7014/connect/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&nonce=${nonce}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;

    window.location.href = authUrl;
  };

  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code || !state) {
      console.error('Missing authorization code or state');
      return false;
    }

    const body = {
      grant_type: 'authorization_code',
      client_id: 'data-pipeline-ui',
      code: code,
      redirect_uri: 'http://localhost:3000/callback',
      code_verifier: '104b4510bee3c3406984f1fac3e4dcc6370586e2cb81bfbee54a8e24',
    };

    try {
      const res = await getTokenAPI(new URLSearchParams(body).toString());
      const access_token = res.access_token;
      const refresh_token = res.refresh_token;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      return true;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return false;
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }

    const body = {
      grant_type: 'refresh_token',
      client_id: 'data-pipeline-ui',
      refresh_token: refreshToken,
    };

    try {
      const res = await getTokenAPI(new URLSearchParams(body).toString());
      // console.log('Refresh Token API response:', res);
      const access_token = res.access_token;
      const refresh_token = res.refresh_token;
      const id_token = res.id_token;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('idToken', id_token);

      const decoded = jwtDecode<JwtPayload>(access_token);
      // console.log('Decoded access token:', decoded);

      const { name, client_id, role } = decoded as JwtPayload & {
        name?: string;
        client_id?: string;
        role?: string;
      };
      localStorage.setItem('name', name || '');
      localStorage.setItem('client_id', client_id || '');
      localStorage.setItem('role', role || '');

      // console.log(name, client_id, role);

      return true;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('idToken');
      return false;
    }
  };

  const checkAuth = () => {
    const accessToken = localStorage?.getItem('accessToken');
    const storedRefreshToken = localStorage?.getItem('refreshToken');

    if (!accessToken || !storedRefreshToken) {
      // console.log('No access token or refresh token found');
      redirectToLogin();
      return false;
    } else {
      const refreshSuccess = refreshToken();
      // console.log('Refresh token success:', refreshSuccess);
      if (!refreshSuccess) {
        redirectToLogin();
        return false;
      }
      return true;
    }
  };

  return { redirectToLogin, handleCallback, refreshToken, checkAuth };
}
