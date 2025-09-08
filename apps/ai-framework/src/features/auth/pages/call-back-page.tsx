import React, { useEffect, useState } from 'react';
import { useAuthGuard } from '@/features/auth/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useSpinner } from '@/shared/hooks/use-spinner';

const CallbackPage: React.FC = () => {
  const { handleCallback, refreshToken, redirectToLogin } = useAuthGuard();
  const navigate = useNavigate();
  const { createSpinner } = useSpinner();

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
  return (
    <div className="h-screen w-full bg-neutral-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {createSpinner({ size: 'lg', color: 'blue', className: 'm-auto' })}
      </div>
    </div>
  );
};

export default CallbackPage;
