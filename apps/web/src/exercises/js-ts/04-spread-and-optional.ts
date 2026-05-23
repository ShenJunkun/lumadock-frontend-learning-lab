export type RequestOptions = {
  headers?: Record<string, string>;
  token?: string;
};

export type ProductDetail = {
  id: string;
  name: string;
  specs?: {
    ports?: string;
    weight?: string;
  };
};

function todo<T>(..._values: unknown[]): T {
  throw new Error("TODO: finish this exercise.");
}

export function buildJsonHeaders(options?: RequestOptions) {
  // TODO:
  // Return a new headers object.
  // Always include "Content-Type": "application/json".
  // If options.token exists, include Authorization: "Bearer <token>".
  // Merge options.headers last so caller headers can override defaults.
  return todo<Record<string, string>>(options);
}

export function readPorts(product?: ProductDetail) {
  // TODO:
  // Use optional chaining and nullish coalescing.
  // Return product.specs.ports when present; otherwise return "Not listed".
  return todo<string>(product);
}

export function withUpdatedName(product: ProductDetail, name: string) {
  // TODO:
  // Return a new object with all existing product fields and the updated name.
  return todo<ProductDetail>(product, name);
}
