import type { JSX } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthProvider';

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-white"></div>
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
