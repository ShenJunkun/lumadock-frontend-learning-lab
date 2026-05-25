export type FeatureFlagKey = "adminInsights";

export type FeatureFlags = Record<FeatureFlagKey, boolean>;

export const defaultFeatureFlags: FeatureFlags = {
  adminInsights: true,
};

type FeatureFlagEnv = {
  VITE_FEATURE_ADMIN_INSIGHTS?: string | boolean | undefined;
};

function parseFlagValue(value: string | boolean | undefined) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  if (/^(1|true|on|yes)$/i.test(value)) {
    return true;
  }
  if (/^(0|false|off|no)$/i.test(value)) {
    return false;
  }
  return undefined;
}

export function resolveFeatureFlags(
  env: FeatureFlagEnv = import.meta.env as FeatureFlagEnv,
): FeatureFlags {
  return {
    ...defaultFeatureFlags,
    adminInsights:
      parseFlagValue(env.VITE_FEATURE_ADMIN_INSIGHTS) ??
      defaultFeatureFlags.adminInsights,
  };
}

export function isFeatureEnabled(
  key: FeatureFlagKey,
  env: FeatureFlagEnv = import.meta.env as FeatureFlagEnv,
) {
  return resolveFeatureFlags(env)[key];
}
