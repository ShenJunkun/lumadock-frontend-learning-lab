import { Skeleton } from "antd";

type ProductGridSkeletonProps = {
  count?: number;
  label?: string;
};

export function ProductGridSkeleton({
  count = 3,
  label = "Loading products",
}: ProductGridSkeletonProps) {
  return (
    <div className="product-grid catalog-grid skeleton-grid" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <div className="product-card skeleton-card" key={index}>
          <Skeleton.Image active className="skeleton-media" />
          <div className="product-card-body">
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: "70%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <section className="page-section detail-page" role="status" aria-label="Loading product detail">
      <div className="detail-hero">
        <div className="detail-copy skeleton-copy">
          <Skeleton active paragraph={{ rows: 4 }} title={{ width: "65%" }} />
          <Skeleton.Button active size="large" />
        </div>
        <Skeleton.Node active className="detail-stage skeleton-stage" />
      </div>
      <div className="detail-grid">
        <Skeleton active className="spec-panel" paragraph={{ rows: 5 }} />
        <Skeleton active className="spec-panel" paragraph={{ rows: 5 }} />
        <Skeleton active className="configurator" paragraph={{ rows: 6 }} />
      </div>
    </section>
  );
}

export function BookingSkeleton() {
  return (
    <section className="page-section booking-page" role="status" aria-label="Loading booking">
      <div className="booking-layout">
        <Skeleton active className="booking-summary" paragraph={{ rows: 6 }} />
        <Skeleton active className="lead-form" paragraph={{ rows: 8 }} />
      </div>
    </section>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="admin-skeleton" role="status" aria-label="Loading admin leads">
      <Skeleton active paragraph={{ rows: 6 }} title={{ width: "35%" }} />
    </div>
  );
}
