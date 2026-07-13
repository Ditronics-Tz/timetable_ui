import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * @param {{ title: string, subtitle?: string, crumbs?: { label: string, to?: string }[], actions?: React.ReactNode }} props
 */
export default function PageHeader({ title, subtitle, crumbs = [], actions }) {
  return (
    <header className="page-header">
      {crumbs.length > 0 && (
        <nav className="page-breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="inline-flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} aria-hidden />}
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
