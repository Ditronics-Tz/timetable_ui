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
import staffService from "../services/staffService";
import usePaginatedList from "../hooks/usePaginatedList";
import { extractApiError } from "../lib/apiError";

export default function ManageStaff() {
  const fetchFn = useCallback((p) => staffService.list(p), []);
  const { items, loading, error, refetch, nextPage, prevPage, offset, hasMore } =
    usePaginatedList(fetchFn, "staff");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [err, setErr] = useState("");

  const startEdit = (s) => {
    setEditing(s.id);
    setForm({
      name: s.name,
      email: s.email,
      max_hours: s.max_hours,
      title: s.title || "",
      phone_number: s.phone_number || "",
    });
  };

  const save = async () => {
    try {
      await staffService.update(editing, {
        name: form.name,
        email: form.email,
        max_hours: Number(form.max_hours),
        title: form.title,
        phone_number: form.phone_number,
      });
      setEditing(null);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  const remove = async (id) => {
    try {
      await staffService.remove(id);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Manage Staff</h1>
        {(error || err) && <div className="text-red-600 text-sm">{error || err}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(s)}>
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
                          <AlertDialogTitle>Delete staff?</AlertDialogTitle>
                          <AlertDialogDescription>Delete “{s.name}”?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(s.id)}>
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
            {["name", "email", "max_hours", "title", "phone_number"].map((k) => (
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
