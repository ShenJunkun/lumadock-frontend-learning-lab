import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export type RouteMetadata = {
  title: string;
  description: string;
};

const siteName = "LumaDock";

const exactRouteMetadata: Record<string, RouteMetadata> = {
  "/": {
    title: `${siteName} | Frontend Learning Product Lab`,
    description:
      "Explore a React, TypeScript, FastAPI, testing, accessibility, and production-readiness learning lab.",
  },
  "/admin": {
    title: `Lead Console | ${siteName}`,
    description: "Review local demo leads with protected routing, role checks, charts, and tables.",
  },
  "/book": {
    title: `Book a Walkthrough | ${siteName}`,
    description: "Submit a local booking request and practice resilient form workflows.",
  },
  "/learn": {
    title: `Learning Roadmap | ${siteName}`,
    description: "Follow the frontend learning roadmap from foundations through production skills.",
  },
  "/login": {
    title: `Login | ${siteName}`,
    description: "Practice JWT demo authentication and protected route behavior.",
  },
  "/products": {
    title: `Product Catalog | ${siteName}`,
    description: "Search and compare LumaDock products backed by API data and resilient fallbacks.",
  },
};

export const fallbackRouteMetadata: RouteMetadata = {
  title: `Page Not Found | ${siteName}`,
  description: "The requested LumaDock learning lab page could not be found.",
};

export function getRouteMetadata(pathname: string): RouteMetadata {
  if (pathname.startsWith("/products/")) {
    return {
      title: `Product Detail | ${siteName}`,
      description: "Explore a LumaDock product detail page with specs, configuration, and booking.",
    };
  }

  return exactRouteMetadata[pathname] ?? fallbackRouteMetadata;
}

function ensureDescriptionMeta() {
  const existingMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (existingMeta) {
    return existingMeta;
  }

  const meta = document.createElement("meta");
  meta.name = "description";
  document.head.append(meta);
  return meta;
}

export function applyRouteMetadata(metadata: RouteMetadata) {
  document.title = metadata.title;
  ensureDescriptionMeta().content = metadata.description;
}

export function RouteMetadataManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyRouteMetadata(getRouteMetadata(pathname));
  }, [pathname]);

  return null;
}
