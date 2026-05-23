export type UserRole = "admin" | "viewer";

export type LeadDraft = {
  company?: string;
  contactEmail?: string;
  productId: string | null;
};

export type Configuration = Record<string, unknown>;

function todo<T>(..._values: unknown[]): T {
  throw new Error("TODO: finish this exercise.");
}

export function parseRole(input: string): UserRole {
  // TODO:
  // Return input when it is "admin" or "viewer".
  // Otherwise return "viewer".
  return todo<UserRole>(input);
}

export function describeLead(draft: LeadDraft) {
  // TODO:
  // Return "<company> wants <productId>".
  // If company is missing, use "Unknown company".
  // If productId is null, use "no product yet".
  return todo<string>(draft);
}

export function readStringConfig(configuration: Configuration, key: string) {
  // TODO:
  // Read configuration[key].
  // Return it only if it is a string.
  // Otherwise return undefined.
  return todo<string | undefined>(configuration, key);
}
