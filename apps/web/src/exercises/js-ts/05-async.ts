export type FetchLike = (path: string) => Promise<unknown>;

function todo<T>(..._values: unknown[]): T {
  throw new Error("TODO: finish this exercise.");
}

export async function fetchProductName(fetchFn: FetchLike, productId: string): Promise<string> {
  // TODO:
  // 1. await fetchFn(`/api/products/${productId}`)
  // 2. The response is unknown. Return response.name only when it is a string.
  // 3. Otherwise throw Error("Invalid product response.")
  return todo<Promise<string>>(fetchFn, productId);
}

export async function fetchWithFallback<T>(fetchFn: () => Promise<T>, fallback: T): Promise<T> {
  // TODO:
  // Return await fetchFn().
  // If fetchFn rejects, return fallback.
  return todo<Promise<T>>(fetchFn, fallback);
}
