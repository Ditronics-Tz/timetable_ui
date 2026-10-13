import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ViewMembers from "./ViewMembers";
import ManageMembers from "./ManageMembers";
import { resetUiShellFixtures } from "../mocks/uiShellFixtures";

vi.mock("../components/PageHeader", () => ({ default: ({ title }) => <h1>{title}</h1> }));

describe("member UI shells", () => {
  afterEach(() => resetUiShellFixtures());

  it("filters the member list and gives a useful empty state", async () => {
    render(<MemoryRouter><ViewMembers /></MemoryRouter>);
    expect(await screen.findByText("Asha Mwakalinga")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox", { name: "Search members" }), { target: { value: "not-here" } });
    expect(screen.getByText("No members match your search.")).toBeInTheDocument();
  });

  it("deactivates a sample member without deleting its record", async () => {
    render(<MemoryRouter><ManageMembers /></MemoryRouter>);
    const deactivateButtons = await screen.findAllByRole("button", { name: "Deactivate" });
    fireEvent.click(deactivateButtons[0]);
    await waitFor(() => expect(screen.getByRole("button", { name: "Deactivated" })).toBeDisabled());
    expect(screen.getByText("Asha Mwakalinga")).toBeInTheDocument();
  });
});
