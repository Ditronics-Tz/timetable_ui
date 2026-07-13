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
import roomService from "../services/roomService";
import usePaginatedList from "../hooks/usePaginatedList";

function parseFeatures(f) {
  if (!f) return {};
  if (typeof f === "object") return f;
  try {
    return JSON.parse(f);
  } catch {
    return {};
  }
}

export default function ViewRooms() {
  const fetchFn = useCallback((p) => roomService.list(p), []);
  const { items, loading, error, nextPage, prevPage, offset, hasMore, refetch } =
    usePaginatedList(fetchFn, "rooms");

  return (
    <div className="p-6">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">View Rooms</h1>
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No rooms yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Sticky</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => {
                const feat = parseFeatures(r.features);
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.capacity}</TableCell>
                    <TableCell>{feat.building || "—"}</TableCell>
                    <TableCell>{feat.lab ? "Yes" : "No"}</TableCell>
                    <TableCell>{r.sticky ? "Yes" : "No"}</TableCell>
                  </TableRow>
                );
              })}
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
