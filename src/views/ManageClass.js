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
import classService from "../services/classService";
import usePaginatedList from "../hooks/usePaginatedList";
import { extractApiError } from "../lib/apiError";

export default function ManageClass() {
  const fetchFn = useCallback((p) => classService.list(p), []);
  const { items, loading, error, refetch, nextPage, prevPage, offset, hasMore } =
    usePaginatedList(fetchFn, "classes");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [err, setErr] = useState("");

  const startEdit = (c) => {
    setEditing(c.id);
    setForm({
      name: c.name,
      year: c.year,
      academic_year: c.academic_year || "",
      number_of_students: c.number_of_students,
    });
  };

  const save = async () => {
    try {
      await classService.update(editing, {
        name: form.name,
        year: Number(form.year),
        academic_year: form.academic_year,
        number_of_students: Number(form.number_of_students),
      });
      setEditing(null);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  const remove = async (id) => {
    try {
      await classService.remove(id);
      refetch();
    } catch (e) {
      setErr(extractApiError(e));
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Manage Classes</h1>
        {(error || err) && <div className="text-red-600 text-sm">{error || err}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.year}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
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
                          <AlertDialogTitle>Delete class?</AlertDialogTitle>
                          <AlertDialogDescription>Delete “{c.name}”?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(c.id)}>
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
            {["name", "year", "academic_year", "number_of_students"].map((k) => (
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
