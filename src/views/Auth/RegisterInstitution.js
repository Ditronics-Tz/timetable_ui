import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import institutionService from "../../services/institutionService";
import { extractApiError } from "../../lib/apiError";

const initial = {
  institution: {
    name: "",
    type: "university",
    region: "",
    country: "Tanzania",
    email: "",
    phone: "",
    address: "",
  },
  admin: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  },
};

function PasswordRules({ password }) {
  const rules = [
    [password.length >= 8, "At least 8 characters"],
    [/[A-Z]/.test(password), "One uppercase letter"],
    [/[a-z]/.test(password), "One lowercase letter"],
    [/[0-9]/.test(password), "One number"],
  ];
  return (
    <ul
      className="grid gap-1 text-sm sm:grid-cols-2"
      aria-label="Password requirements"
    >
      {rules.map(([passed, label]) => (
        <li
          key={label}
          className={passed ? "text-emerald-700" : "text-slate-500"}
        >
          {passed ? "✓" : "○"} {label}
        </li>
      ))}
    </ul>
  );
}

export default function RegisterInstitution() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [logoName, setLogoName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const update = (section, key, value) =>
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));

  const passwordValid =
    form.admin.password.length >= 8 &&
    /[A-Z]/.test(form.admin.password) &&
    /[a-z]/.test(form.admin.password) &&
    /[0-9]/.test(form.admin.password);

  const submit = async (event) => {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (!passwordValid) return;
    setBusy(true);
    setError("");
    try {
      const result = await institutionService.registerInstitution(form);
      setSubmittedEmail(result?.email || form.admin.email);
    } catch (requestError) {
      setError(
        extractApiError(requestError) ||
          requestError?.message ||
          "Registration preview could not be submitted."
      );
    } finally {
      setBusy(false);
    }
  };

  if (submittedEmail) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Registration received</h1>
        <Card className="space-y-3 p-6">
          <p>
            In the live service, a verification code would be sent to{" "}
            <strong>{submittedEmail}</strong>.
          </p>
          <p className="text-sm text-amber-800">
            This is a demo preview. No real institution or admin account was
            created.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a
                href={`/verify-email?email=${encodeURIComponent(
                  submittedEmail
                )}`}
              >
                Proceed to verify email
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setForm(initial);
                setStep(1);
                setSubmittedEmail("");
              }}
            >
              Register another institution
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-slate-500">Step {step} of 2</p>
        <h1 className="text-2xl font-semibold">Register your institution</h1>
        <p className="text-slate-600">
          Set up your institution and its first administrator.
        </p>
      </header>
      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Demo preview: this form uses sample data and does not create a real
        account.
      </p>
      <div
        className="h-2 overflow-hidden rounded bg-slate-100"
        aria-label={`Step ${step} of 2`}
      >
        <div
          className={`h-full bg-blue-600 transition-all ${
            step === 1 ? "w-1/2" : "w-full"
          }`}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <Card className="p-6">
        <form onSubmit={submit} className="space-y-5">
          {step === 1 ? (
            <>
              <h2 className="text-lg font-semibold">Institution details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="institution-name">Institution name *</Label>
                  <Input
                    id="institution-name"
                    required
                    value={form.institution.name}
                    onChange={(e) =>
                      update("institution", "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="institution-type">Type *</Label>
                  <select
                    id="institution-type"
                    required
                    className="h-10 w-full rounded-md border px-3"
                    value={form.institution.type}
                    onChange={(e) =>
                      update("institution", "type", e.target.value)
                    }
                  >
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="institution-region">Region *</Label>
                  <Input
                    id="institution-region"
                    required
                    value={form.institution.region}
                    onChange={(e) =>
                      update("institution", "region", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="institution-country">Country *</Label>
                  <Input
                    id="institution-country"
                    required
                    value={form.institution.country}
                    onChange={(e) =>
                      update("institution", "country", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="institution-email">Institution email *</Label>
                  <Input
                    id="institution-email"
                    type="email"
                    required
                    value={form.institution.email}
                    onChange={(e) =>
                      update("institution", "email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="institution-phone">Phone *</Label>
                  <Input
                    id="institution-phone"
                    type="tel"
                    required
                    value={form.institution.phone}
                    onChange={(e) =>
                      update("institution", "phone", e.target.value)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="institution-address">Address *</Label>
                  <Input
                    id="institution-address"
                    required
                    value={form.institution.address}
                    onChange={(e) =>
                      update("institution", "address", e.target.value)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="institution-logo">Logo (optional)</Label>
                  <Input
                    id="institution-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setLogoName(e.target.files?.[0]?.name || "")
                    }
                  />
                  {logoName && (
                    <p className="mt-1 text-xs text-slate-500">
                      Selected: {logoName}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">First administrator</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="admin-first-name">First name *</Label>
                  <Input
                    id="admin-first-name"
                    required
                    value={form.admin.first_name}
                    onChange={(e) =>
                      update("admin", "first_name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="admin-last-name">Last name *</Label>
                  <Input
                    id="admin-last-name"
                    required
                    value={form.admin.last_name}
                    onChange={(e) =>
                      update("admin", "last_name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="admin-email">Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    required
                    value={form.admin.email}
                    onChange={(e) => update("admin", "email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-phone">Phone *</Label>
                  <Input
                    id="admin-phone"
                    type="tel"
                    required
                    value={form.admin.phone}
                    onChange={(e) => update("admin", "phone", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="admin-password">Password *</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={form.admin.password}
                    onChange={(e) =>
                      update("admin", "password", e.target.value)
                    }
                  />
                  <PasswordRules password={form.admin.password} />
                </div>
              </div>
            </>
          )}
          <div className="flex flex-wrap justify-between gap-2 border-t pt-4">
            {step === 2 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="submit"
              disabled={busy || (step === 2 && !passwordValid)}
            >
              {busy
                ? "Submitting…"
                : step === 1
                  ? "Continue"
                  : "Submit registration"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
