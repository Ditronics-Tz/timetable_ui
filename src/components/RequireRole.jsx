import { Link } from "react-router-dom";
import { hasRole, getCurrentUser, getRole, isAuthenticated } from "../lib/auth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShieldAlert } from "lucide-react";

/**
 * Role gate for admin-only screens. Role is read from JWT claims (see getRole).
 * Renders nothing until auth is resolved so protected content never flashes.
 * @param {string[]} allow - roles permitted
 */
export default function RequireRole({ allow = ["administrator", "super_admin"], children }) {
  if (!isAuthenticated()) {
    return null;
  }

  if (hasRole(...allow)) {
    return children;
  }

  const user = getCurrentUser();
  const role = getRole();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6" role="alert">
      <Card className="max-w-md w-full p-8 text-center space-y-4 border shadow-sm">
        <div className="flex justify-center">
          <ShieldAlert className="h-12 w-12 text-amber-500" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Insufficient permissions</h1>
        <p className="text-sm text-gray-600">
          Your account
          {user?.email ? ` (${user.email})` : ""}
          {role ? ` has role “${role}”` : ""} and cannot access this
          administration screen. Contact a system administrator if you need access.
        </p>
        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
