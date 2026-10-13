import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import usePaginatedList from "./usePaginatedList";

function ListProbe({ fetchFn }) {
  const { items, loading, error } = usePaginatedList(fetchFn, "rooms");
  return (
    <div>
      <span>{loading ? "Loading" : "Ready"}</span>
      {error ? <span role="alert">{error}</span> : null}
      <span>{items.length} {items.length === 1 ? "room" : "rooms"}</span>
    </div>
  );
}

describe("usePaginatedList loading lifecycle", () => {
  it("starts in loading state before the first request resolves", async () => {
    let resolveRequest;
    const fetchFn = vi.fn(
      () => new Promise((resolve) => { resolveRequest = resolve; })
    );

    render(<ListProbe fetchFn={fetchFn} />);
    expect(screen.getByText("Loading")).toBeInTheDocument();

    resolveRequest({ rooms: [{ id: 1 }] });
    await waitFor(() => expect(screen.getByText("Ready")).toBeInTheDocument());
    expect(screen.getByText("1 room")).toBeInTheDocument();
  });

  it("ends loading and exposes request errors", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error("Offline"));

    render(<ListProbe fetchFn={fetchFn} />);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});
