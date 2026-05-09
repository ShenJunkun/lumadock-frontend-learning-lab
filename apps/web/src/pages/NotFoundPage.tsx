import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="page-section not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <Link className="secondary-button" to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Back home</span>
      </Link>
    </section>
  );
}
