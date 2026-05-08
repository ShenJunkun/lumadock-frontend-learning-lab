import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export type TelemetryEventName =
  | "booking_submit_failed"
  | "booking_submit_succeeded"
  | "route_view";

export type TelemetryPayload = Record<string, boolean | number | string | null>;

export type TelemetryEvent = {
  name: TelemetryEventName;
  payload: TelemetryPayload;
  timestamp: string;
};

const piiKeys = new Set(["company", "email", "message", "name", "role"]);
const telemetryEvents: TelemetryEvent[] = [];

function sanitizePayload(payload: Record<string, unknown>): TelemetryPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      if (piiKeys.has(key.toLowerCase())) {
        return false;
      }
      return (
        typeof value === "boolean" ||
        typeof value === "number" ||
        typeof value === "string" ||
        value === null
      );
    }),
  ) as TelemetryPayload;
}

export function trackEvent(name: TelemetryEventName, payload: Record<string, unknown> = {}) {
  telemetryEvents.push({
    name,
    payload: sanitizePayload(payload),
    timestamp: new Date().toISOString(),
  });
}

export function getTelemetryEvents() {
  return [...telemetryEvents];
}

export function clearTelemetryEvents() {
  telemetryEvents.length = 0;
}

export function RouteTelemetryRecorder() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackEvent("route_view", { pathname });
  }, [pathname]);

  return null;
}
