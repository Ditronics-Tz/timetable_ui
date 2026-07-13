import { Link } from "react-router-dom";
import { hasRole, getCurrentUser } from "../lib/auth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShieldAlert } from "lucide-react";

/**
 * Role gate for admin-only screens.
 * @param {string[]} allow - roles permitted
 */
export default function RequireRole({ allow = ["administrator", "super_admin"], children }) {
  if (hasRole(...allow)) {
    return children;
  }

  const user = getCurrentUser();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <div className="flex justify-center">
          <ShieldAlert className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Insufficient permissions</h1>
        <p className="text-sm text-gray-600">
          Your account
          {user?.email ? ` (${user.email})` : ""}
          {user?.role ? ` has role “${user.role}”` : ""} and cannot access this
          timetable administration screen. Contact a system administrator if you
          need access.
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
