import { useCallback } from "react";
import { Card } from "../components/ui/card";
import DataTable from "../components/DataTable";
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
        <DataTable
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          emptyMessage="No programs yet."
          onRetry={refetch}
        >
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
        </DataTable>
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
