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
import facultyService from "../services/facultyService";
import usePaginatedList from "../hooks/usePaginatedList";
import { extractApiError } from "../lib/apiError";

export default function ManageDepartments() {
  const fetchFn = useCallback((params) => facultyService.list(params), []);
  const { items, loading, error, refetch, nextPage, prevPage, offset, hasMore } =
    usePaginatedList(fetchFn, "faculties");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const startEdit = (d) => {
    setEditing(d.id);
    setForm({
      name: d.name || "",
      description: d.description || "",
      hod_name: d.hod_name || "",
      hod_phone: d.hod_phone || "",
      hod_email: d.hod_email || "",
    });
    setMsg("");
    setErr("");
  };

  const save = async () => {
    try {
      await facultyService.update(editing, form);
      setMsg("Updated.");
      setEditing(null);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  const remove = async (id) => {
    try {
      await facultyService.remove(id);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Manage Departments</h1>
        {(error || err) && <div className="text-red-600 text-sm">{error || err}</div>}
        {msg && <div className="text-green-700 text-sm">{msg}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>HOD</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.hod_name}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(d)}>
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
                          <AlertDialogTitle>Delete department?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will soft-delete “{d.name}”. This cannot easily be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(d.id)}>
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
            <h3 className="font-semibold">Edit faculty #{editing}</h3>
            {["name", "description", "hod_name", "hod_phone", "hod_email"].map((k) => (
              <div key={k}>
                <Label>{k}</Label>
                <Input
                  value={form[k] || ""}
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
