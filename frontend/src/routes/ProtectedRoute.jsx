import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle') hydrate();
  }, [hydrate, status]);

  if (status !== 'ready') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-body text-sm text-char/50">
        Checking your session...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
}
