import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import {
  clearTelemetryEvents,
  getTelemetryEvents,
  RouteTelemetryRecorder,
  trackEvent,
} from "./telemetry";

describe("telemetry", () => {
  beforeEach(() => clearTelemetryEvents());

  it("records sanitized events without form PII", () => {
    trackEvent("booking_submit_succeeded", {
      email: "ada@example.com",
      name: "Ada Lovelace",
      productId: "lumadock-studio",
      role: "Engineer",
    });

    expect(getTelemetryEvents()).toEqual([
      expect.objectContaining({
        name: "booking_submit_succeeded",
        payload: { productId: "lumadock-studio" },
      }),
    ]);
  });

  it("records route views from the active browser route", async () => {
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <RouteTelemetryRecorder />
      </MemoryRouter>,
    );

    await waitFor(() => expect(getTelemetryEvents()).toHaveLength(1));
    expect(getTelemetryEvents()[0]).toMatchObject({
      name: "route_view",
      payload: { pathname: "/products" },
    });
  });
});
