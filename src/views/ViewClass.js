import { useCallback } from "react";
import { Card } from "../components/ui/card";
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
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No classes yet.</p>
        ) : (
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
