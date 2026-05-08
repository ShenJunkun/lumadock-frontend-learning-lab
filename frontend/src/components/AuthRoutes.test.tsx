import { render, screen } from "@testing-library/react";
import { Route, Routes, MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("antd")>();
  return {
    ...actual,
    notification: {
      ...actual.notification,
      warning: vi.fn(),
    },
  };
});

import { PrivateRoute, RoleRoute } from "./AuthRoutes";
import { useAuthStore } from "../store/authStore";

function renderRoutes(initialPath = "/admin") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleRoute roles={["admin"]}>
                <h1>Admin console</h1>
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("auth routes", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({ isAuthenticated: false, token: null, user: null });
  });

  it("redirects anonymous users to login", () => {
    renderRoutes();

    expect(screen.getByRole("heading", { name: "Login page" })).toBeInTheDocument();
  });

  it("allows admin users through", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      token: "admin-token",
      user: {
        email: "admin@lumadock.local",
        id: 1,
        name: "LumaDock Admin",
        role: "admin",
      },
    });

    renderRoutes();

    expect(screen.getByRole("heading", { name: "Admin console" })).toBeInTheDocument();
  });

  it("blocks users without the required role", () => {
    useAuthStore.setState({
      isAuthenticated: true,
      token: "viewer-token",
      user: {
        email: "viewer@lumadock.local",
        id: 2,
        name: "LumaDock Viewer",
        role: "viewer",
      },
    });

    renderRoutes();

    expect(screen.getByText("No access")).toBeInTheDocument();
  });
});
