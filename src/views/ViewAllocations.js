import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
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

  useEffect(() => {
    staffService
      .list({ limit: 200 })
      .then((d) => setStaff(d.staff || []))
      .catch((e) => setError(extractApiError(e)));
  }, []);

  const load = async () => {
    if (!staffId) return;
    setLoading(true);
    setError("");
    try {
      const d = await staffService.listModules(staffId);
      setModules(d.modules || []);
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
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label>Staff member</Label>
            <select
              className="w-full border rounded h-10 px-2"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={load} disabled={!staffId || loading}>
            {loading ? "Loading..." : "Load modules"}
          </Button>
        </div>
        {modules.length === 0 ? (
          <p className="text-gray-500 text-sm">No modules assigned (or not loaded).</p>
        ) : (
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
        )}
      </Card>
    </div>
  );
}
