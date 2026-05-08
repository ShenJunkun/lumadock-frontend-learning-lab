import { ArrowRight, CalendarDays, Cpu, Gauge, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { useProducts, useStats } from "../api/products";
import { ConfiguratorPanel } from "../components/ConfiguratorPanel";
import { ProductCard } from "../components/ProductCard";
import { ProductSceneBoundary } from "../components/ProductSceneBoundary";
import { ProductScene } from "../components/ProductScene";
import { ScrollReveal } from "../components/ScrollReveal";
import { ErrorState, LoadingState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

const featureTiles = [
  {
    icon: Cpu,
    title: "Adaptive port memory",
    copy: "Profiles keep desk, travel, and studio devices ready.",
  },
  {
    icon: Gauge,
    title: "Focused status surface",
    copy: "Subtle light states show power, sync, and display flow.",
  },
  {
    icon: ShieldCheck,
    title: "Local-first demo",
    copy: "The app talks only to the local FastAPI service.",
  },
];

export function HomePage() {
  const productsQuery = useProducts();
  const statsQuery = useStats();
  const products = productsQuery.data?.length ? productsQuery.data : fallbackProducts;
  const featured = products[0];

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Product showcase platform</span>
          <h1>LumaDock</h1>
          <p>
            A refined desktop docking system for focused work, rich product storytelling, and
            hands-on frontend learning.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/products">
              <span>Explore products</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="secondary-button" to="/book">
              <CalendarDays size={18} aria-hidden="true" />
              <span>Book a demo</span>
            </Link>
          </div>
          <dl className="metric-strip">
            <div>
              <dt>Products</dt>
              <dd>{statsQuery.data?.products ?? products.length}</dd>
            </div>
            <div>
              <dt>Avg price</dt>
              <dd>${Math.round(statsQuery.data?.average_price ?? 302)}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>React</dd>
            </div>
          </dl>
        </div>
        <div className="hero-media" aria-label="LumaDock product render">
          <img src="/assets/lumadock-hero.png" alt="LumaDock desktop dock product render" />
        </div>
      </section>

      <section className="section section-tight">
        <div className="section-heading">
          <span className="eyebrow">Interaction model</span>
          <h2>Built for visual product learning</h2>
        </div>
        <div className="feature-grid">
          {featureTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <ScrollReveal className="feature-card" key={tile.title}>
                <Icon size={22} aria-hidden="true" />
                <h3>{tile.title}</h3>
                <p>{tile.copy}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="section showcase-layout">
        <ScrollReveal className="showcase-copy">
          <span className="eyebrow">Live 3D preview</span>
          <h2>Rotate the product surface through code.</h2>
          <p>
            React Three Fiber renders a lightweight product model while Framer Motion handles page
            movement and reveal timing.
          </p>
          {productsQuery.isLoading && (
            <LoadingState title="Loading catalog" message="Checking the local API." />
          )}
          {productsQuery.isError && (
            <ErrorState
              title="Using local fallback data"
              message="Start the backend on port 8001 to switch this section to SQLite-backed data."
            />
          )}
        </ScrollReveal>
        <ScrollReveal className="showcase-stage" delay={0.08}>
          <ProductSceneBoundary>
            <ProductScene accent={featured.accent} />
          </ProductSceneBoundary>
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <ConfiguratorPanel basePrice={featured.price} />
        </ScrollReveal>
      </section>

      <section className="section">
        <div className="section-heading row-heading">
          <div>
            <span className="eyebrow">Catalog</span>
            <h2>Choose a LumaDock profile</h2>
          </div>
          <Link className="text-link" to="/products">
            View all
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
