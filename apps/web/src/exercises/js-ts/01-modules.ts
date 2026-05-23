export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
};

function todo<T>(..._values: unknown[]): T {
  throw new Error("TODO: finish this exercise.");
}

export function normalizeBaseUrl(baseUrl: string) {
  // TODO:
  // 1. Remove leading/trailing whitespace.
  // 2. Remove one trailing slash.
  // 3. Throw Error("A non-empty API base URL is required.") when the result is empty.
  return todo<string>(baseUrl);
}

export function buildProductPath(productId: string) {
  // TODO: return a template string like /api/products/luma-dock
  return todo<string>(productId);
}

export function createProductLabel(product: CatalogProduct) {
  // TODO: return "Luma Dock ($299)" for { name: "Luma Dock", price: 299 }
  return todo<string>(product);
}
