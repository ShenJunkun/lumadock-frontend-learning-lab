import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useProduct } from "../api/products";
import { ConfiguratorPanel } from "../components/ConfiguratorPanel";
import { ProductSceneBoundary } from "../components/ProductSceneBoundary";
import { ProductScene } from "../components/ProductScene";
import { ErrorState, LoadingState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

export function ProductDetailPage() {
  const { productId } = useParams();
  const fallbackProduct = fallbackProducts.find((product) => product.id === productId);
  const productQuery = useProduct(productId);
  const product = productQuery.data ?? fallbackProduct;

  if (productQuery.isLoading && !product) {
    return (
      <section className="page-section">
        <LoadingState title="Loading product" message="Fetching the detail route." />
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page-section">
        <ErrorState title="Product not found" message="Choose a product from the catalog." />
      </section>
    );
  }

  return (
    <section className="page-section detail-page">
      <div className="detail-hero">
        <div className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" to={`/book?product=${product.id}`}>
              <span>Book {product.name}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          {productQuery.isError && (
            <ErrorState
              title="Using fallback detail"
              message="Start FastAPI to read this product from SQLite."
            />
          )}
        </div>
        <div className="detail-stage">
          <ProductSceneBoundary>
            <ProductScene accent={product.accent} />
          </ProductSceneBoundary>
        </div>
      </div>

      <div className="detail-grid">
        <section className="spec-panel">
          <span className="eyebrow">Highlights</span>
          <h2>Product capabilities</h2>
          <ul className="check-list">
            {product.features.map((feature) => (
              <li key={feature}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="spec-panel">
          <span className="eyebrow">Specs</span>
          <h2>Desk fit</h2>
          <dl className="spec-list">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ConfiguratorPanel basePrice={product.price} />
      </div>
    </section>
  );
}
