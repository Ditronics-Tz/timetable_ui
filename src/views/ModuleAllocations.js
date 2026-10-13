import { useCallback, useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import ListState from "../components/ListState";
import moduleService from "../services/moduleService";
import staffService from "../services/staffService";
import { extractApiError } from "../lib/apiError";

export default function ModuleAllocations() {
  const [modules, setModules] = useState([]);
  const [staff, setStaff] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [assignedError, setAssignedError] = useState("");

  const loadOptions = useCallback(async () => {
    setOptionsLoading(true);
    setOptionsError("");
    try {
      const [moduleData, staffData] = await Promise.all([
        moduleService.list({ limit: 200 }),
        staffService.list({ limit: 200 }),
      ]);
      setModules(moduleData.modules || []);
      setStaff(staffData.staff || []);
    } catch (err) {
      setOptionsError(extractApiError(err));
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    if (!moduleId) {
      setAssignedIds(new Set());
      setSelected(new Set());
      setAssignedError("");
      setAssignedLoading(false);
      return;
    }
    let active = true;
    setAssignedLoading(true);
    setAssignedError("");
    moduleService
      .listStaff(moduleId)
      .then((d) => {
        if (!active) return;
        const ids = new Set((d.staff || []).map((x) => Number(x.id)));
        setAssignedIds(ids);
        setSelected(new Set(ids));
      })
      .catch((e) => {
        if (active) setAssignedError(extractApiError(e));
      })
      .finally(() => {
        if (active) setAssignedLoading(false);
      });
    return () => {
      active = false;
    };
  }, [moduleId]);

  const reloadAssigned = async () => {
    if (!moduleId) return;
    setAssignedLoading(true);
    setAssignedError("");
    try {
      const data = await moduleService.listStaff(moduleId);
      const ids = new Set((data.staff || []).map((item) => Number(item.id)));
      setAssignedIds(ids);
      setSelected(new Set(ids));
    } catch (err) {
      setAssignedError(extractApiError(err));
    } finally {
      setAssignedLoading(false);
    }
  };

  const toggle = (id, checked) => {
    const n = Number(id);
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(n);
      else next.delete(n);
      return next;
    });
  };

  const save = async () => {
    if (!moduleId) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const mid = Number(moduleId);
      const selectedNums = new Set([...selected].map(Number));
      const assignedNums = new Set([...assignedIds].map(Number));
      const toAdd = [...selectedNums].filter((id) => !assignedNums.has(id));
      const toRemove = [...assignedNums].filter((id) => !selectedNums.has(id));
      await Promise.all([
        ...toAdd.map((sid) => staffService.assignModule(sid, mid)),
        ...toRemove.map((sid) => staffService.unassignModule(sid, mid)),
      ]);
      setAssignedIds(selectedNums);
      setSelected(selectedNums);
      setMessage("Allocations saved.");
    } catch (e) {
      setError(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Module allocation</h1>
        <p className="text-sm text-gray-500">
          Assign staff who are qualified to teach a module (staff_modules).
        </p>
        {optionsError && <ListState error={optionsError} onRetry={loadOptions} />}
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        {message && <div className="text-green-700 text-sm">{message}</div>}
        <div>
          <Label>Module</Label>
          {optionsLoading ? <ListState loading /> : null}
          {!optionsLoading && !optionsError && modules.length === 0 ? (
            <ListState isEmpty emptyMessage="No modules are available. Add a module first." />
          ) : null}
          <select
            className="w-full border rounded h-10 px-2"
            value={moduleId}
            disabled={optionsLoading || !!optionsError || modules.length === 0}
            onChange={(e) => setModuleId(e.target.value)}
          >
            <option value="">Select module</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code ? `${m.code} — ` : ""}
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {moduleId && (
          <div className="space-y-2 max-h-96 overflow-auto border rounded p-3">
            {assignedLoading ? (
              <ListState loading />
            ) : assignedError ? (
              <ListState error={assignedError} onRetry={reloadAssigned} />
            ) : staff.length === 0 ? (
              <ListState isEmpty emptyMessage="No staff are available. Add staff first." />
            ) : (
              staff.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`staff-${s.id}`}
                    checked={selected.has(Number(s.id))}
                    onCheckedChange={(checked) => toggle(s.id, !!checked)}
                  />
                  <Label htmlFor={`staff-${s.id}`}>
                    {s.name} ({s.email})
                  </Label>
                </div>
              ))
            )}
          </div>
        )}
        <Button onClick={save} disabled={!moduleId || loading}>
          {loading ? "Saving..." : "Save allocations"}
        </Button>
      </Card>
    </div>
  );
}
