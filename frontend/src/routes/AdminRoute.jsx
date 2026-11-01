import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

export default function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (status === 'idle') hydrate();
  }, [hydrate, status]);

  if (status !== 'ready') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist font-body text-sm text-char/50">
        Checking admin session...
      </div>
    );
  }
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return children;
}
