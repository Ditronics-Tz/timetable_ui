import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

/**
 * Wraps protected routes; redirects to /login with return path.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}
