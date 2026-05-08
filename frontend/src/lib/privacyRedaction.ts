const sensitiveKeyPattern = /company|email|message|name|password|role|token/i;
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const bearerTokenPattern = /Bearer\s+[A-Za-z0-9._~+/=-]+/gi;

export type RedactableValue =
  | boolean
  | null
  | number
  | RedactableValue[]
  | string
  | { [key: string]: RedactableValue };

export function redactText(value: string) {
  return value
    .replace(emailPattern, "[redacted-email]")
    .replace(bearerTokenPattern, "Bearer [redacted-token]");
}

export function redactSensitiveData<T extends RedactableValue>(value: T): T {
  if (typeof value === "string") {
    return redactText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item)) as T;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sensitiveKeyPattern.test(key) ? "[redacted]" : redactSensitiveData(item),
    ]),
  ) as T;
}
