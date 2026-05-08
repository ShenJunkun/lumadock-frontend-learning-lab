import {
  CalendarDays,
  GraduationCap,
  Home,
  Layers3,
  LogIn,
  LogOut,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { message } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { RouteFocus } from "./RouteFocus";
import {
  languageOptions,
  themeModeOptions,
  usePreferencesStore,
  type LanguageId,
  type ThemeMode,
} from "../store/preferencesStore";

type AppShellProps = {
  children: ReactNode;
};

const navItems = [
  { to: "/", labelKey: "shell.home", icon: Home, end: true },
  { to: "/products", labelKey: "shell.products", icon: PackageSearch },
  { to: "/book", labelKey: "shell.book", icon: CalendarDays },
  { to: "/learn", labelKey: "shell.learn", icon: GraduationCap },
];

export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const language = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);

  const handleLogout = () => {
    logout();
    void message.success("Logged out.");
    navigate("/");
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <RouteFocus />
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
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
          {isAuthenticated && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            >
              <ShieldCheck size={17} aria-hidden="true" />
              <span>{t("shell.admin")}</span>
            </NavLink>
          )}
          {!isAuthenticated ? (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            >
              <LogIn size={17} aria-hidden="true" />
              <span>{t("shell.login")}</span>
            </NavLink>
          ) : (
            <button className="nav-link nav-button" type="button" onClick={handleLogout}>
              <LogOut size={17} aria-hidden="true" />
              <span>{t("shell.logout")}</span>
            </button>
          )}
          <div className="shell-controls" aria-label="Preferences">
            <label>
              <span className="visually-hidden">{t("shell.language")}</span>
              <select
                className="preference-select"
                aria-label={t("shell.language")}
                value={language}
                onChange={(event) => setLanguage(event.target.value as LanguageId)}
              >
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="visually-hidden">{t("shell.theme")}</span>
              <select
                className="preference-select"
                aria-label={t("shell.theme")}
                value={themeMode}
                onChange={(event) => setThemeMode(event.target.value as ThemeMode)}
              >
                {themeModeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {t(option.labelKey)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <span>{t("shell.footerLab")}</span>
        <span>{t("shell.footerStack")}</span>
      </footer>
    </div>
  );
}
