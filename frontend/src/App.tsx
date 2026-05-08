import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { PrivateRoute, RoleRoute } from "./components/AuthRoutes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AdminPage } from "./pages/AdminPage";
import { BookingPage } from "./pages/BookingPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { LearnPage } from "./pages/LearnPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

export function App() {
  const location = useLocation();

  return (
    <AppShell>
      <ErrorBoundary resetKey={location.pathname} title="Page unavailable">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <RoleRoute roles={["admin"]}>
                  <AdminPage />
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </AppShell>
  );
}
