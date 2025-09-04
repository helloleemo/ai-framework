import React, { useEffect, useState } from 'react';
import { useAuthGuard } from '@/features/auth/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const CallbackPage: React.FC = () => {
  const { handleCallback, refreshToken, redirectToLogin } = useAuthGuard();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const processSuccess = await handleCallback();
        if (processSuccess) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            navigate('/ai-framework/artboard');
          } else {
            redirectToLogin();
          }
        } else {
          redirectToLogin();
        }
      } catch (error) {
        redirectToLogin();
        console.error('error', error);
      }
    };
    processCallback();
  }, []);
  return <div>授權中...</div>;
};

export default CallbackPage;
