import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { PrivateRoute, RoleRoute } from "./components/AuthRoutes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { RouteSkeleton } from "./components/SkeletonStates";

const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((module) => ({ default: module.AdminPage })),
);
const BookingPage = lazy(() =>
  import("./pages/BookingPage").then((module) => ({ default: module.BookingPage })),
);
const CatalogPage = lazy(() =>
  import("./pages/CatalogPage").then((module) => ({ default: module.CatalogPage })),
);
const HomePage = lazy(() =>
  import("./pages/HomePage").then((module) => ({ default: module.HomePage })),
);
const LearnPage = lazy(() =>
  import("./pages/LearnPage").then((module) => ({ default: module.LearnPage })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })),
);
const ProductDetailPage = lazy(() =>
  import("./pages/ProductDetailPage").then((module) => ({ default: module.ProductDetailPage })),
);

export function App() {
  const location = useLocation();

  return (
    <AppShell>
      <ErrorBoundary resetKey={location.pathname} title="Page unavailable">
        <Suspense fallback={<RouteSkeleton />}>
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
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
