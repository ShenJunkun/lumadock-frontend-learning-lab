import type { ReactNode } from "react";

import { ErrorBoundary } from "./ErrorBoundary";

type ProductSceneBoundaryProps = {
  children: ReactNode;
};

export function ProductSceneBoundary({ children }: ProductSceneBoundaryProps) {
  return (
    <ErrorBoundary compact title="Product preview unavailable">
      {children}
    </ErrorBoundary>
  );
}
