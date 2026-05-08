import { Result } from "antd";
import { notification } from "antd";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types/auth";

type PrivateRouteProps = {
  children: ReactNode;
};

type RoleRouteProps = PrivateRouteProps & {
  roles: UserRole[];
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
}

export function RoleRoute({ children, roles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <PrivateRoute>
        <>{children}</>
      </PrivateRoute>
    );
  }

  if (!roles.includes(user.role)) {
    return <ForbiddenResult />;
  }

  return children;
}

function ForbiddenResult() {
  useEffect(() => {
    notification.warning({
      description: "This page requires a different LumaDock role.",
      title: "Permission denied",
    });
  }, []);

  return (
    <Result status="403" title="No access" subTitle="This page requires a different LumaDock role." />
  );
}
