import { useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import generationSettingsService from "../services/generationSettingsService";
import { extractApiError } from "../lib/apiError";

const WEIGHTS = [
  { key: "preferred_start_weight", label: "Preferred staff start time" },
  { key: "session_spread_weight", label: "Spread sessions across the week" },
];

export default function GenerationSettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [solverAvailable, setSolverAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await generationSettingsService.get();
      setSettings({
        engine: result.settings?.engine || "auto",
        time_budget_sec: result.settings?.time_budget_sec ?? 30,
        soft_weights: result.settings?.soft_weights || {},
      });
      setSolverAvailable(!!result.solver_available);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (event) => {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        engine: settings.engine,
        time_budget_sec: Number(settings.time_budget_sec),
        soft_weights: Object.fromEntries(
          WEIGHTS.map(({ key }) => [key, Number(settings.soft_weights[key] || 0)])
        ),
      };
      const result = await generationSettingsService.update(payload);
      setSettings({
        engine: result.settings.engine,
        time_budget_sec: result.settings.time_budget_sec,
        soft_weights: result.settings.soft_weights || {},
      });
      setMessage("Generation settings saved for this deployment.");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const updateWeight = (key, value) => {
    setSettings((current) => ({
      ...current,
      soft_weights: { ...current.soft_weights, [key]: value },
    }));
    setMessage("");
  };

  return (
    <Card className="max-w-3xl p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Generation settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These settings are saved on the server for this deployment and apply to future runs.
        </p>
      </div>

      {loading ? (
        <p role="status">Loading generation settings…</p>
      ) : error && !settings ? (
        <div role="alert" className="space-y-2 text-sm text-red-700">
          <p>{error}</p>
          <Button type="button" variant="outline" onClick={load}>Retry</Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={save}>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="text-sm text-green-700">{message}</p>}

          <div className="space-y-2">
            <Label htmlFor="generation_engine">Engine</Label>
            <select
              id="generation_engine"
              className="w-full rounded-md border bg-white px-3 py-2"
              value={settings.engine}
              onChange={(event) => {
                setSettings({ ...settings, engine: event.target.value });
                setMessage("");
              }}
            >
              <option value="auto">Automatic (use deployment solver and fallback settings)</option>
              <option value="solver" disabled={!solverAvailable}>OR-Tools solver</option>
              <option value="greedy">Greedy fallback</option>
            </select>
            {!solverAvailable && (
              <p className="text-xs text-muted-foreground">The solver is unavailable because this deployment has no SOLVER_URL.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="generation_time_budget">Solver time budget (seconds)</Label>
            <input
              id="generation_time_budget"
              type="number"
              min="1"
              max="300"
              step="1"
              required
              className="h-10 w-full rounded-md border px-3"
              value={settings.time_budget_sec}
              onChange={(event) => {
                setSettings({ ...settings, time_budget_sec: event.target.value });
                setMessage("");
              }}
            />
            <p className="text-xs text-muted-foreground">Choose 1–300 seconds. The server validates this limit before saving.</p>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Soft constraint weights</legend>
            {WEIGHTS.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <input
                  id={key}
                  type="number"
                  min="0"
                  step="0.1"
                  className="h-10 w-full rounded-md border px-3"
                  value={settings.soft_weights[key] ?? 0}
                  onChange={(event) => updateWeight(key, event.target.value)}
                />
              </div>
            ))}
          </fieldset>

          <Button type="submit" disabled={saving || loading}>
            {saving ? "Saving…" : "Save generation settings"}
          </Button>
        </form>
      )}
    </Card>
  );
}
