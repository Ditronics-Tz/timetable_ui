import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CsvImport from "./CsvImport";

const columns = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
];

describe("CSV import review", () => {
  it("previews valid rows and confirms only after the user chooses", async () => {
    const onConfirm = vi.fn().mockResolvedValue({ message: "Imported." });
    render(<CsvImport columns={columns} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Upload CSV" }));
    const file = { text: () => Promise.resolve("name,email\nJane Doe,jane@example.edu\n") };
    fireEvent.change(screen.getByLabelText("CSV file"), { target: { files: [file] } });

    expect(await screen.findByText("1 rows are ready to import.")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Confirm import" }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("Imported.")).toBeInTheDocument();
  });

  it("shows required-field row errors and blocks confirmation", async () => {
    render(<CsvImport columns={columns} onConfirm={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Upload CSV" }));
    const file = { text: () => Promise.resolve("name,email\n,jane@example.edu\n") };
    fireEvent.change(screen.getByLabelText("CSV file"), { target: { files: [file] } });

    expect(await screen.findByText("Rows to fix (1)")).toBeInTheDocument();
    expect(screen.getByText("Row 2, name: Name is required.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm import" })).toBeDisabled();
  });
});
