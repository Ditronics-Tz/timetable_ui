import { useCallback, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import moduleService from "../services/moduleService";
import usePaginatedList from "../hooks/usePaginatedList";
import { extractApiError } from "../lib/apiError";

export default function ManageModule() {
  const fetchFn = useCallback((p) => moduleService.list(p), []);
  const { items, loading, error, refetch, nextPage, prevPage, offset, hasMore } =
    usePaginatedList(fetchFn, "modules");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [err, setErr] = useState("");

  const startEdit = (m) => {
    setEditing(m.id);
    setForm({
      name: m.name || "",
      code: m.code || "",
      credit_hours: m.credit_hours,
      type: m.type,
      nta_level: m.nta_level || "",
    });
  };

  const save = async () => {
    try {
      await moduleService.update(editing, {
        name: form.name,
        code: form.code,
        credit_hours: Number(form.credit_hours),
        type: form.type,
        nta_level: form.nta_level,
      });
      setEditing(null);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  const remove = async (id) => {
    try {
      await moduleService.remove(id);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Manage Modules</h1>
        {(error || err) && <div className="text-red-600 text-sm">{error || err}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(m)}>
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete module?</AlertDialogTitle>
                          <AlertDialogDescription>Delete “{m.name}”?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(m.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {editing && (
          <div className="border rounded p-4 space-y-3">
            <h3 className="font-semibold">Edit module #{editing}</h3>
            {["name", "code", "credit_hours", "type", "nta_level"].map((k) => (
              <div key={k}>
                <Label>{k}</Label>
                <Input
                  value={form[k] ?? ""}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={save}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" disabled={offset <= 0} onClick={prevPage}>
            Previous
          </Button>
          <Button variant="outline" disabled={!hasMore} onClick={nextPage}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
