import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RegisterInstitution from "./RegisterInstitution";
import { submitInstitutionRegistration } from "../../mocks/uiShellFixtures";

vi.mock("../../mocks/uiShellFixtures", () => ({
  submitInstitutionRegistration: vi.fn().mockResolvedValue({ accepted: true, email: "admin@example.edu" }),
}));

describe("institution registration wizard preview", () => {
  it("collects institution and admin details in two steps with a live password rule", async () => {
    render(<RegisterInstitution />);
    fireEvent.change(screen.getByLabelText("Institution name *"), { target: { value: "Sacas Institute" } });
    fireEvent.change(screen.getByLabelText("Region *"), { target: { value: "Dar es Salaam" } });
    fireEvent.change(screen.getByLabelText("Institution email *"), { target: { value: "info@example.edu" } });
    fireEvent.change(screen.getByLabelText("Phone *"), { target: { value: "+255700000000" } });
    fireEvent.change(screen.getByLabelText("Address *"), { target: { value: "Dar es Salaam" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("heading", { name: "First administrator" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("First name *"), { target: { value: "Asha" } });
    fireEvent.change(screen.getByLabelText("Last name *"), { target: { value: "Mushi" } });
    fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "admin@example.edu" } });
    fireEvent.change(screen.getByLabelText("Phone *"), { target: { value: "+255711111111" } });
    fireEvent.change(screen.getByLabelText("Password *"), { target: { value: "StrongPass1" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit registration" }));

    await waitFor(() => expect(submitInstitutionRegistration).toHaveBeenCalledTimes(1));
    expect(submitInstitutionRegistration).toHaveBeenCalledWith(expect.objectContaining({
      institution: expect.objectContaining({ name: "Sacas Institute" }),
      admin: expect.objectContaining({ email: "admin@example.edu", password: "StrongPass1" }),
    }));
    expect(await screen.findByText(/No real institution or admin account was created/)).toBeInTheDocument();
  });
});
