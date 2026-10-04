import { useCallback, useState } from "react";
import { Card } from "../components/ui/card";
import DataTable from "../components/DataTable";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import subjectService from "../services/subjectService";
import usePaginatedList from "../hooks/usePaginatedList";
import { extractApiError } from "../lib/apiError";

export default function ManageSubjects() {
  const fetchFn = useCallback((page) => subjectService.list(page), []);
  const { items, loading, error, refetch, nextPage, prevPage, offset, hasMore } = usePaginatedList(fetchFn, "subjects");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", credit_hours: "" });
  const [actionError, setActionError] = useState("");

  const startEdit = (subject) => {
    setEditing(subject.id);
    setForm({ name: subject.name || "", credit_hours: String(subject.credit_hours ?? "") });
    setActionError("");
  };

  const save = async () => {
    setActionError("");
    try {
      await subjectService.update(editing, { name: form.name.trim(), credit_hours: Number(form.credit_hours) });
      setEditing(null);
      refetch();
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  const remove = async (id) => {
    setActionError("");
    try {
      await subjectService.remove(id);
      if (items.length === 1 && offset > 0) prevPage();
      else refetch();
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Manage Subjects</h1>
        {actionError && <div role="alert" className="text-red-600 text-sm">{actionError}</div>}
        <DataTable
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          emptyMessage="No subjects found."
          onRetry={refetch}
        >
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Credit hours</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell><TableCell>{subject.credit_hours}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(subject)}>Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="sm" variant="destructive">Delete</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete subject?</AlertDialogTitle><AlertDialogDescription>Delete “{subject.name}”?</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => remove(subject.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </DataTable>
        {editing !== null && (
          <div className="border rounded p-4 space-y-3">
            <h2 className="font-semibold">Edit subject #{editing}</h2>
            <div><Label htmlFor="edit-subject-name">Name</Label><Input id="edit-subject-name" required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
            <div><Label htmlFor="edit-subject-credit-hours">Credit hours</Label><Input id="edit-subject-credit-hours" type="number" min={1} max={10} required value={form.credit_hours} onChange={(event) => setForm({ ...form, credit_hours: event.target.value })} /></div>
            <div className="flex gap-2"><Button onClick={save}>Save</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" disabled={offset <= 0} onClick={prevPage}>Previous</Button>
          <Button variant="outline" disabled={!hasMore} onClick={nextPage}>Next</Button>
        </div>
      </Card>
    </div>
  );
}
