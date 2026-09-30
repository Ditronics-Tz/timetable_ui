import { useCallback } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import subjectService from "../services/subjectService";
import usePaginatedList from "../hooks/usePaginatedList";

export default function ViewSubjects() {
  const fetchFn = useCallback((page) => subjectService.list(page), []);
  const { items, loading, error, nextPage, prevPage, offset, hasMore, refetch } = usePaginatedList(fetchFn, "subjects");

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">View Subjects</h1>
          <Button variant="outline" onClick={refetch}>Refresh</Button>
        </div>
        {error && <div role="alert" className="text-red-600 text-sm">{error}</div>}
        {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-gray-500">No subjects yet.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Credit hours</TableHead></TableRow></TableHeader>
            <TableBody>{items.map((subject) => (
              <TableRow key={subject.id}><TableCell>{subject.name}</TableCell><TableCell>{subject.credit_hours}</TableCell></TableRow>
            ))}</TableBody>
          </Table>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" disabled={offset <= 0} onClick={prevPage}>Previous</Button>
          <Button variant="outline" disabled={!hasMore} onClick={nextPage}>Next</Button>
        </div>
      </Card>
    </div>
  );
}
