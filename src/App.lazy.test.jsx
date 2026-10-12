import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./components/Layout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("./components/RequireAuth", () => ({ default: ({ children }) => children }));
vi.mock("./components/Toast", () => ({ ToastProvider: ({ children }) => children }));
vi.mock("./views/Dashboard", () => ({
  default: () => <h1>Lazy dashboard loaded</h1>,
}));

describe("route-level code splitting", () => {
  it("loads a route view on demand and resolves the page", async () => {
    window.history.replaceState({}, "", "/dashboard");

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Lazy dashboard loaded" })).toBeInTheDocument();
  });
});
