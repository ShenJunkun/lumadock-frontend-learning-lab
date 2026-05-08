import { CalendarDays, GraduationCap, Home, Layers3, PackageSearch } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", label: "首页", icon: Home, end: true },
  { to: "/products", label: "产品目录", icon: PackageSearch },
  { to: "/book", label: "预约", icon: CalendarDays },
  { to: "/learn", label: "学习章节", icon: GraduationCap },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="LumaDock home">
          <span className="brand-mark" aria-hidden="true">
            <Layers3 size={20} />
          </span>
          <span>LumaDock</span>
        </NavLink>
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
              >
                <Icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>Independent frontend learning lab</span>
        <span>React + TypeScript + FastAPI</span>
      </footer>
    </div>
  );
}
