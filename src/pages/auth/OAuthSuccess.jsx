import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, clearAuthError } from '../../features/auth/authSlice';
import { getCurrentUser } from '../../features/auth/authThunks';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      if (token) {
        dispatch(clearAuthError());
        dispatch(setToken(token));
        await dispatch(getCurrentUser());
        navigate('/', { replace: true });
      } else {
        navigate('/login?error=OAuthTokenMissing', { replace: true });
      }
    };
    handleOAuth();
  }, [token, dispatch, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Completing login...</h2>
        <p className="text-gray-500 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
