import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DataTable from "./DataTable";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "./ui/table";

describe("shared data table and list states", () => {
  it("renders the shared table in a horizontally scrollable frame", () => {
    const { container } = render(
      <DataTable>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Room 101</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DataTable>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("overflow-x-auto");
    expect(screen.getByText("Room 101")).toBeInTheDocument();
  });

  it("shows loading, retryable error, and empty states consistently", () => {
    const retry = vi.fn().mockResolvedValue(undefined);
    const { rerender } = render(<DataTable loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");

    rerender(<DataTable error="Could not load rooms" onRetry={retry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load rooms");
    screen.getByRole("button", { name: "Try again" }).click();
    expect(retry).toHaveBeenCalledOnce();

    rerender(<DataTable isEmpty emptyMessage="No rooms found." />);
    expect(screen.getByRole("status")).toHaveTextContent("No rooms found.");
  });
});
