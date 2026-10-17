import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import institutionService from "../../services/institutionService";
import { extractApiError } from "../../lib/apiError";

function getInitialToken() {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("token") || "";
  } catch {
    return "";
  }
}

export default function AcceptInvitation() {
  const [form, setForm] = useState({
    token: getInitialToken(),
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  const passwordValid =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /[0-9]/.test(form.password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!passwordValid) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await institutionService.acceptInvitation(form);
      setCompleted(true);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setBusy(false);
    }
  };

  if (completed) {
    return (
      <div className="mx-auto max-w-xl space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Invitation accepted</h1>
        <Card className="space-y-4 p-6">
          <p className="text-sm text-slate-700">
            Your institution account is ready. You can now sign in with your
            email and password.
          </p>
          <Button asChild>
            <a href="/login">Proceed to sign in</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Accept institution invitation</h1>
        <p className="text-sm text-slate-600">
          Complete your profile and set a password to join your institution on
          SACAS.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="invite-token">Invitation token *</Label>
            <Input
              id="invite-token"
              required
              value={form.token}
              onChange={(e) => setForm({ ...form, token: e.target.value })}
              placeholder="Paste token from your invitation email"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="invite-first-name">First name *</Label>
              <Input
                id="invite-first-name"
                required
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="invite-last-name">Last name *</Label>
              <Input
                id="invite-last-name"
                required
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="invite-phone">Phone number</Label>
            <Input
              id="invite-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="invite-password">Password *</Label>
            <Input
              id="invite-password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="mt-1 text-xs text-slate-500">
              Minimum 8 characters with uppercase, lowercase, and a number.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <a href="/login" className="text-sm text-blue-700 underline">
              Back to sign in
            </a>
            <Button type="submit" disabled={busy || !passwordValid}>
              {busy ? "Activating…" : "Accept invitation"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
