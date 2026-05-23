export type ProductSummary = {
  id: string;
  name: string;
  price: number;
  tags: string[];
};

function todo<T>(..._values: unknown[]): T {
  throw new Error("TODO: finish this exercise.");
}

export function getFeaturedNames(products: ProductSummary[]) {
  // TODO:
  // Return names for products whose tags include "featured".
  // Hint: use filter(...).map(...)
  return todo<string[]>(products);
}

export function formatPrice(product: ProductSummary) {
  // TODO:
  // Return "Free" when price is 0.
  // Otherwise return "$<price>".
  // Hint: use a ternary expression.
  return todo<string>(product);
}

export function buildCatalogSummary(products: ProductSummary[]) {
  // TODO:
  // Return "3 products: Dock, Stand, Hub" for three products.
  // Hint: use products.length and map(...).join(", ")
  return todo<string>(products);
}
