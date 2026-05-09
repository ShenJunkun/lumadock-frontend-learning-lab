import { describe, expect, it, vi } from "vitest";

import { registerPwaServiceWorker, shouldRegisterPwaServiceWorker } from "./pwa";

describe("pwa registration", () => {
  it("only enables service worker registration in production when supported", () => {
    const navigatorLike = {
      serviceWorker: {
        register: vi.fn(),
      },
    };

    expect(shouldRegisterPwaServiceWorker(false, navigatorLike)).toBe(false);
    expect(shouldRegisterPwaServiceWorker(true, {})).toBe(false);
    expect(shouldRegisterPwaServiceWorker(true, navigatorLike)).toBe(true);
  });

  it("registers the static service worker script when enabled", async () => {
    const register = vi.fn().mockResolvedValue(undefined);

    await expect(
      registerPwaServiceWorker({
        isProduction: true,
        navigatorLike: { serviceWorker: { register } },
      }),
    ).resolves.toBe(true);

    expect(register).toHaveBeenCalledWith("/sw.js");
  });

  it("skips registration outside production", async () => {
    const register = vi.fn();

    await expect(
      registerPwaServiceWorker({
        isProduction: false,
        navigatorLike: { serviceWorker: { register } },
      }),
    ).resolves.toBe(false);

    expect(register).not.toHaveBeenCalled();
  });
});
