import type { AdminLead } from "@lumadock/api-client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

type VirtualLeadListProps = {
  leads: AdminLead[];
};

export function VirtualLeadList({ leads }: VirtualLeadListProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  // TanStack Virtual intentionally returns imperative helpers that React Compiler should skip.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: leads.length,
    estimateSize: () => 82,
    getScrollElement: () => parentRef.current,
    overscan: 5,
  });

  if (!leads.length) {
    return <p className="m-0 text-sm text-muted">No lead activity yet.</p>;
  }

  return (
    <div className="virtual-list" ref={parentRef} aria-label="Lead activity">
      <div
        className="virtual-list-inner"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const lead = leads[virtualRow.index];
          return (
            <article
              className="virtual-lead-row"
              key={lead.id}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div>
                <strong>{lead.name}</strong>
                <span>{lead.email}</span>
              </div>
              <div>
                <span>{lead.product_name ?? lead.product_id ?? "Unassigned"}</span>
                <time dateTime={lead.created_at}>{new Date(lead.created_at).toLocaleString()}</time>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
