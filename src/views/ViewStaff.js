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
import staffService from "../services/staffService";
import usePaginatedList from "../hooks/usePaginatedList";

export default function ViewStaff() {
  const fetchFn = useCallback((p) => staffService.list(p), []);
  const { items, loading, error, nextPage, prevPage, offset, hasMore, refetch } =
    usePaginatedList(fetchFn, "staff");

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">View Staff</h1>
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>
        </div>
        <DataTable
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          emptyMessage="No staff yet."
          onRetry={refetch}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Max hours</TableHead>
                <TableHead>Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.faculty?.name || s.faculty_id}</TableCell>
                  <TableCell>{s.max_hours}</TableCell>
                  <TableCell>{s.title}</TableCell>
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
