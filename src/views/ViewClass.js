import { useCallback } from "react";
import { Card } from "../components/ui/card";
import DataTable from "../components/DataTable";
import { Button } from "../components/ui/button";
import PageHeader from "../components/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import classService from "../services/classService";
import usePaginatedList from "../hooks/usePaginatedList";

export default function ViewClass() {
  const fetchFn = useCallback((p) => classService.list(p), []);
  const { items, loading, error, nextPage, prevPage, offset, hasMore, refetch } =
    usePaginatedList(fetchFn, "classes");

  return (
    <div className="space-y-6">
      <PageHeader
        title="View classes"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Classes", to: "/classes/view" },
          { label: "View" },
        ]}
        actions={
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>
        }
      />
      <Card className="p-6 space-y-4">
        <DataTable
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
          emptyMessage="No classes yet."
          onRetry={refetch}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Year of study</TableHead>
                <TableHead>Academic year</TableHead>
                <TableHead>Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.course?.name || c.course_id}</TableCell>
                  <TableCell>{c.year}</TableCell>
                  <TableCell>{c.academic_year}</TableCell>
                  <TableCell>{c.number_of_students}</TableCell>
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
