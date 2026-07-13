import { useEffect, useState } from "react";
import Navbar, { MobileMenuButton } from "./Navbar";

/**
 * Production app shell: CSS grid with sidebar column + main content.
 * Sidebar is NOT position:fixed alone — the grid reserves its width.
 */
export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
        <div className="app-shell-mobile-bar">
          <MobileMenuButton onClick={() => setMobileOpen(true)} />
          <span className="font-semibold text-slate-800 text-sm">SACAS</span>
        </div>
        <main className="app-main-inner">{children}</main>
      </div>
    </div>
  );
}
