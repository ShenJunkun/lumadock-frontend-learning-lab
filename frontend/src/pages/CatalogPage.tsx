import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useProducts } from "../api/products";
import { ProductCard } from "../components/ProductCard";
import { ErrorState, LoadingState, EmptyState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

export function CatalogPage() {
  const [query, setQuery] = useState("");
  const productsQuery = useProducts();
  const products = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return products;
    }
    return products.filter((product) =>
      [product.name, product.category, product.tagline].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [products, query]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <span className="eyebrow">Product catalog</span>
        <h1>LumaDock lineup</h1>
        <p>Search, compare, and open each detail route.</p>
      </div>

      <label className="search-box">
        <Search size={18} aria-hidden="true" />
        <span className="visually-hidden">Search products</span>
        <input
          value={query}
          placeholder="Search by name or category"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {productsQuery.isLoading && (
        <LoadingState title="Loading catalog" message="Fetching products from FastAPI." />
      )}
      {productsQuery.isError && (
        <ErrorState
          title="Local API unavailable"
          message="Fallback product data is visible so the frontend stays usable."
        />
      )}

      {filteredProducts.length ? (
        <div className="product-grid catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="No matching products" message="Try another name or category." />
      )}
    </section>
  );
}
