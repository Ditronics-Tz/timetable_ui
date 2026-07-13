import { useCallback, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import facultyService from "../services/facultyService";
import usePaginatedList from "../hooks/usePaginatedList";
import "../styles/ViewDepartment.css";

export default function ViewDepartments() {
  const fetchFn = useCallback(
    (params) => facultyService.list(params),
    []
  );
  const { items, loading, error, nextPage, prevPage, offset, hasMore, refetch } =
    usePaginatedList(fetchFn, "faculties", { pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = items.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hod_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">View Departments</h1>
            <p className="text-sm text-gray-500">Faculties from the API</p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No departments found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>HOD</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.description}</TableCell>
                  <TableCell>{d.hod_name}</TableCell>
                  <TableCell>{d.hod_phone}</TableCell>
                  <TableCell>{d.hod_email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" disabled={offset <= 0 || loading} onClick={prevPage}>
            Previous
          </Button>
          <Button variant="outline" disabled={!hasMore || loading} onClick={nextPage}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
