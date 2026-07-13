import { useCallback } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import courseService from "../services/courseService";
import usePaginatedList from "../hooks/usePaginatedList";

export default function ViewProgram() {
  const fetchFn = useCallback((p) => courseService.list(p), []);
  const { items, loading, error, nextPage, prevPage, offset, hasMore, refetch } =
    usePaginatedList(fetchFn, "courses");

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">View Programs</h1>
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No programs yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.faculty?.name || c.faculty_id}</TableCell>
                  <TableCell>{c.level}</TableCell>
                  <TableCell>{c.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
