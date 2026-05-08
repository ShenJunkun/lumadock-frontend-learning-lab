import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import type { Product } from "../types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      className="product-card"
      to={`/products/${product.id}`}
      style={{ "--accent": product.accent } as CSSProperties}
    >
      <div className="product-card-media">
        <img src={product.hero_image} alt="" loading="lazy" />
      </div>
      <div className="product-card-body">
        <span className="eyebrow">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.tagline}</p>
        <div className="product-card-footer">
          <strong>${product.price}</strong>
          <span className="icon-link" aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

