import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { router } from './app/router';
import { getCurrentUser } from './features/auth/authThunks';
import { authInitialized } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    } else {
      dispatch(authInitialized());
    }
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
