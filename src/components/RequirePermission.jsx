import { Link } from "react-router-dom";
import {
  can,
  canAny,
  getCurrentUser,
  getRole,
  isAuthenticated,
  isSupportSession,
} from "../lib/auth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShieldAlert, Building2 } from "lucide-react";

/**
 * Permission & workspace gate for SACAS routes.
 * @param {object} props
 * @param {string|string[]} [props.permission] - required permission(s) (all must match)
 * @param {string[]} [props.anyOf] - any of these permissions suffices
 * @param {"institution"|"platform"} [props.workspace] - optional workspace boundary
 */
export default function RequirePermission({
  permission,
  anyOf,
  workspace,
  children,
}) {
  if (!isAuthenticated()) {
    return null;
  }

  const user = getCurrentUser();
  const role = getRole();
  const supportSession = isSupportSession();

  if (
    workspace === "institution" &&
    role === "super_admin" &&
    !supportSession
  ) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center p-6"
        role="alert"
      >
        <Card className="max-w-md w-full p-8 text-center space-y-4 border shadow-sm">
          <div className="flex justify-center">
            <Building2 className="h-12 w-12 text-blue-600" aria-hidden />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Platform console account
          </h1>
          <p className="text-sm text-gray-600">
            Your account{user?.email ? ` (${user.email})` : ""} has role{" "}
            <strong>super_admin</strong>, which manages platform-level
            institutions and users rather than a single institution workspace. To
            inspect an institution, use &ldquo;View as Institution&rdquo; from
            the Super Admin console.
          </p>
          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link to="/superadmin/institutions">
                Go to Super Admin Console
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/settings">Settings</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const hasRequired = permission ? can(permission) : true;
  const hasAny =
    Array.isArray(anyOf) && anyOf.length > 0 ? canAny(...anyOf) : true;

  if (hasRequired && hasAny) {
    return children;
  }

  const requiredList = [
    ...(Array.isArray(permission)
      ? permission
      : permission
        ? [permission]
        : []),
    ...(Array.isArray(anyOf) ? anyOf : []),
  ];

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center p-6"
      role="alert"
    >
      <Card className="max-w-md w-full p-8 text-center space-y-4 border shadow-sm">
        <div className="flex justify-center">
          <ShieldAlert className="h-12 w-12 text-amber-500" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          Insufficient permissions
        </h1>
        <p className="text-sm text-gray-600">
          Your account
          {user?.email ? ` (${user.email})` : ""}
          {role ? ` has role “${role}”` : ""} and cannot access this
          administration screen.
          {requiredList.length > 0
            ? ` Required permission: ${requiredList.join(" or ")}.`
            : ""}{" "}
          Contact a system administrator if you need access.
        </p>
        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline">
            <Link
              to={
                role === "super_admin" && !supportSession
                  ? "/superadmin/institutions"
                  : "/dashboard"
              }
            >
              Back to dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
