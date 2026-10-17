import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar, { MobileMenuButton } from "./Navbar";
import {
  exitSupportSession,
  fetchMyPermissions,
  getAuth,
  getInstitution,
  getRole,
  isAuthenticated,
  isSupportSession,
} from "../lib/auth";
import { getLastApiError } from "../services/api";
import { useI18n } from "../lib/i18n";

/**
 * Production app shell: CSS grid with sidebar column + main content.
 * Sidebar is NOT position:fixed alone — the grid reserves its width.
 */
export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportSaved, setReportSaved] = useState(false);
  const [, setPermTick] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) return;
    const auth = getAuth();
    if (Array.isArray(auth?.permissions) && auth.permissions.length > 0) return;
    let active = true;
    fetchMyPermissions()
      .then(() => {
        if (active) setPermTick((n) => n + 1);
      })
      .catch(() => {
        // Ignore in offline/unit-test environments; role fallback permissions apply
      });
    return () => {
      active = false;
    };
  }, []);

  const supportSession = isSupportSession();
  const institution = getInstitution();
  const role = getRole();
  const lastError = getLastApiError();

  const handleExitSupport = () => {
    exitSupportSession();
    setPermTick((n) => n + 1);
    navigate("/superadmin/institutions");
  };

  const handleReportSubmit = (event) => {
    event.preventDefault();
    const payload = {
      route: location.pathname + location.search,
      role: role || "unknown",
      institution: institution?.name || null,
      lastApiError: lastError,
      note: reportNote.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(
        localStorage.getItem("sacas_problem_reports") || "[]"
      );
      existing.unshift(payload);
      localStorage.setItem(
        "sacas_problem_reports",
        JSON.stringify(existing.slice(0, 20))
      );
    } catch {
      // ignore storage errors
    }
    setReportSaved(true);
    setReportNote("");
  };

  const shellClass = [
    "app-shell",
    collapsed ? "is-collapsed" : "",
    mobileOpen ? "is-mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      <div
        className="app-sidebar-backdrop"
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <Navbar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="app-main">
        {supportSession && (
          <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-2 bg-amber-600 px-4 py-2 text-xs font-medium text-white"
          >
            <span>
              {t("support.banner", "Support read-only view")}
              {institution?.name ? `: ${institution.name}` : ""}
            </span>
            <button
              type="button"
              onClick={handleExitSupport}
              className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-50"
            >
              {t("support.exit", "Exit institution view")}
            </button>
          </div>
        )}
        <div className="app-shell-mobile-bar">
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
          <span className="font-semibold text-slate-800 text-sm truncate">
            {institution?.name || "SACAS"}
          </span>
        </div>
        <main className="app-main-inner">{children}</main>
        <footer className="px-6 py-3 border-t border-slate-200 bg-white/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 print:hidden">
          <span>
            SACAS Timetable System
            {institution?.name ? ` · ${institution.name}` : ""}
          </span>
          <button
            type="button"
            onClick={() => {
              setReportSaved(false);
              setReportOpen((v) => !v);
            }}
            className="underline hover:text-slate-800"
          >
            {t("report.button", "Report a problem")}
          </button>
        </footer>
        {reportOpen && (
          <div
            role="dialog"
            aria-label={t("report.title", "Report a problem")}
            className="fixed bottom-12 right-4 z-50 w-full max-w-md rounded-lg border bg-white p-4 shadow-xl space-y-3 print:hidden"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                {t("report.title", "Report a problem")}
              </h2>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                {t("report.close", "Close")}
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {t(
                "report.description",
                "Share what went wrong. Your current page, role, and last API error are attached automatically."
              )}
            </p>
            <div className="rounded bg-slate-50 p-2 text-xs text-slate-700 space-y-1">
              <div>
                <strong>Page:</strong> {location.pathname}
              </div>
              <div>
                <strong>Role:</strong> {role || "unknown"}
              </div>
              <div>
                <strong>Last API error:</strong>{" "}
                {lastError
                  ? `${lastError.method} ${lastError.url} (${lastError.status}): ${lastError.message}`
                  : "None"}
              </div>
            </div>
            {reportSaved ? (
              <p role="status" className="text-xs font-medium text-emerald-700">
                {t("report.saved", "Problem report recorded for pilot support.")}
              </p>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-2">
                <textarea
                  aria-label="Problem description"
                  required
                  rows={3}
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Describe what you expected and what happened…"
                  className="w-full rounded border p-2 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="rounded border px-3 py-1.5 text-xs"
                  >
                    {t("report.close", "Close")}
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {t("report.submit", "Submit report")}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
