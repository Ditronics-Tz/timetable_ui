import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Exams from "./Exams";
import MyExams from "./MyExams";
import AnalyticsDashboard from "./AnalyticsDashboard";
import SuperAdminConsole from "./SuperAdminConsole";
import InstitutionSettings from "./InstitutionSettings";
import { clearAuth, setAuth } from "../lib/auth";
import { I18nProvider, setSavedLanguage, translate } from "../lib/i18n";

function makeToken(expSecondsFromNow, role) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + expSecondsFromNow,
      role,
    })
  );
  return `${header}.${payload}.sig`;
}

describe("Exams, Analytics, SuperAdmin, InstitutionSettings & i18n", () => {
  beforeEach(() => {
    clearAuth();
    setSavedLanguage("en");
  });

  it("renders Exams workflow and allows switching to Schedule Exam tab", async () => {
    setAuth({
      token: makeToken(3600, "administrator"),
      user: { id: 1, role: "administrator" },
    });
    render(
      <MemoryRouter>
        <Exams />
      </MemoryRouter>
    );
    expect(await screen.findByText("CS201 Final Exam")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Schedule Exam" }));
    expect(
      screen.getByRole("heading", { name: "Schedule an examination" })
    ).toBeInTheDocument();
  });

  it("renders lecturer MyExams invigilation schedule", async () => {
    setAuth({
      token: makeToken(3600, "user"),
      user: { id: 2, role: "user" },
    });
    render(
      <MemoryRouter>
        <MyExams />
      </MemoryRouter>
    );
    expect(await screen.findByText("CS201 Final Exam")).toBeInTheDocument();
  });

  it("renders AnalyticsDashboard metrics, room utilisation, and heatmap", async () => {
    render(
      <MemoryRouter>
        <AnalyticsDashboard />
      </MemoryRouter>
    );
    expect(await screen.findByText("Scheduled classes")).toBeInTheDocument();
    expect(await screen.findByText("Lab 101")).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Weekly slot coverage heatmap" })
    ).toBeInTheDocument();
  });

  it("approves pending institution in SuperAdminConsole", async () => {
    render(
      <MemoryRouter initialEntries={["/superadmin/institutions"]}>
        <SuperAdminConsole />
      </MemoryRouter>
    );
    expect(
      await screen.findByText("Sacas Institute of Technology")
    ).toBeInTheDocument();
    const approveBtn = screen.getByRole("button", { name: "Approve" });
    fireEvent.click(approveBtn);
    expect(
      await screen.findByText(/status updated to active/i)
    ).toBeInTheDocument();
  });

  it("loads and saves InstitutionSettings", async () => {
    render(
      <MemoryRouter>
        <InstitutionSettings />
      </MemoryRouter>
    );
    expect(
      await screen.findByDisplayValue("Sacas Institute of Technology")
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Save schedule settings" })
    );
    expect(
      await screen.findByText("Institution schedule settings saved.")
    ).toBeInTheDocument();
  });

  it("translates navigation keys between English and Swahili", () => {
    expect(translate("nav.dashboard", "Dashboard", "en")).toBe("Dashboard");
    expect(translate("nav.dashboard", "Dashboard", "sw")).toBe("Dashibodi");
    expect(translate("nav.rooms", "Rooms", "sw")).toBe("Vyumba");
    render(
      <I18nProvider>
        <div>i18n mounted</div>
      </I18nProvider>
    );
    expect(screen.getByText("i18n mounted")).toBeInTheDocument();
  });
});
