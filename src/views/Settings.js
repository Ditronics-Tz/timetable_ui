import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import authService from "../services/Authservice";
import { extractApiError } from "../lib/apiError";
import { getCurrentUser } from "../lib/auth";
import "../styles/Settings.css";

/**
 * Account settings — wired to real profile / change-password APIs.
 * Coordinator/role CRUD UI was mock-only and has been removed.
 */
export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    authService
      .getProfile()
      .then((data) => {
        if (!cancelled) {
          setProfile(data.user || data || getCurrentUser());
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setProfile(getCurrentUser());
          setError(extractApiError(e));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (pw.new_password !== pw.confirm) {
      setError("New passwords do not match");
      return;
    }
    if (pw.new_password.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword({
        current_password: pw.current_password,
        new_password: pw.new_password,
      });
      setMessage("Password updated successfully.");
      setPw({ current_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-sm text-gray-500">
        Account settings for the signed-in user. Admin coordinator/role management
        is not implemented as a separate product surface (use user admin APIs).
      </p>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>}
      {message && <div className="p-3 bg-green-50 text-green-800 rounded text-sm">{message}</div>}

      <Card className="p-6 space-y-3 max-w-lg">
        <h2 className="text-xl font-semibold">Profile</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <dl className="text-sm space-y-2">
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium">{profile?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium">
                {[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium">{profile?.role || "—"}</dd>
            </div>
          </dl>
        )}
      </Card>

      <Card className="p-6 space-y-4 max-w-lg">
        <h2 className="text-xl font-semibold">Change password</h2>
        <form onSubmit={handlePassword} className="space-y-3">
          <div>
            <Label htmlFor="current_password">Current password</Label>
            <Input
              id="current_password"
              type="password"
              required
              value={pw.current_password}
              onChange={(e) => setPw({ ...pw, current_password: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              type="password"
              required
              minLength={6}
              value={pw.new_password}
              onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              required
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
