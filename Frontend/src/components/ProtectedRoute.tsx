import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../Context/AuthProvider";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
