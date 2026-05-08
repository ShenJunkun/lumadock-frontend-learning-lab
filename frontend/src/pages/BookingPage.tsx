import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useProducts } from "../api/products";
import { LeadForm } from "../components/LeadForm";
import { ProductSceneBoundary } from "../components/ProductSceneBoundary";
import { ProductScene } from "../components/ProductScene";
import { ErrorState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const productsQuery = useProducts();
  const products = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
  const requestedProduct = searchParams.get("product") ?? products[0]?.id;
  const [selectedId, setSelectedId] = useState(requestedProduct);
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId],
  );

  return (
    <section className="page-section booking-page">
      <div className="section-heading">
        <span className="eyebrow">Booking</span>
        <h1>Reserve a LumaDock walkthrough</h1>
        <p>The submitted lead is stored in the local SQLite database.</p>
      </div>

      {productsQuery.isError && (
        <ErrorState
          title="Catalog API unavailable"
          message="The form can still be explored, but submission needs FastAPI on port 8001."
        />
      )}

      <div className="booking-layout">
        <aside className="booking-summary">
          <label>
            <span>Product</span>
            <select
              value={selectedProduct.id}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <ProductSceneBoundary>
            <ProductScene accent={selectedProduct.accent} />
          </ProductSceneBoundary>
          <div>
            <span className="eyebrow">{selectedProduct.category}</span>
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.tagline}</p>
          </div>
        </aside>
        <LeadForm productId={selectedProduct.id} />
      </div>
    </section>
  );
}
