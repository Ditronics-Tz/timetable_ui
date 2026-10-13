import { useCallback, useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import DataTable from "../components/DataTable";
import ListState from "../components/ListState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import staffService from "../services/staffService";
import { extractApiError } from "../lib/apiError";

export default function ViewAllocations() {
  const [staff, setStaff] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState("");
  const [modulesLoaded, setModulesLoaded] = useState(false);

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    setStaffError("");
    try {
      const data = await staffService.list({ limit: 200 });
      setStaff(data.staff || []);
    } catch (err) {
      setStaffError(extractApiError(err));
    } finally {
      setStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const load = async () => {
    if (!staffId) return;
    setLoading(true);
    setError("");
    setModulesLoaded(false);
    try {
      const d = await staffService.listModules(staffId);
      setModules(d.modules || []);
      setModulesLoaded(true);
    } catch (e) {
      setError(extractApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">View allocations</h1>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label>Staff member</Label>
            <select
              className="w-full border rounded h-10 px-2"
              value={staffId}
              disabled={staffLoading || !!staffError || staff.length === 0}
              onChange={(e) => {
                setStaffId(e.target.value);
                setModules([]);
                setModulesLoaded(false);
                setError("");
              }}
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={load} disabled={!staffId || loading || staffLoading}>
            {loading ? "Loading..." : "Load modules"}
          </Button>
        </div>
        {staffLoading ? (
          <ListState loading />
        ) : staffError ? (
          <ListState error={staffError} onRetry={loadStaff} />
        ) : staff.length === 0 ? (
          <ListState isEmpty emptyMessage="No staff records are available." />
        ) : loading ? (
          <ListState loading />
        ) : error ? (
          <ListState error={error} onRetry={load} />
        ) : !modulesLoaded ? (
          <p className="py-4 text-sm text-muted-foreground">Choose a staff member, then load their modules.</p>
        ) : modules.length === 0 ? (
          <ListState isEmpty emptyMessage="No modules are assigned to this staff member." />
        ) : (
          <DataTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.id}</TableCell>
                    <TableCell>{m.code}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell>{m.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTable>
        )}
      </Card>
    </div>
  );
}
