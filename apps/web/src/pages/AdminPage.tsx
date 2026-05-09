import type { AdminLead } from "@lumadock/api-client";
import { StatusBadge, SurfaceCard } from "@lumadock/ui";
import { useQuery } from "@tanstack/react-query";
import { Button, Descriptions, Modal, Result, Table, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect } from "react";
import { useMemo, useState } from "react";

import { getAdminLeads } from "../api/admin";
import { AdminInsights } from "../components/AdminInsights";
import { AdminTableSkeleton } from "../components/SkeletonStates";
import { VirtualLeadList } from "../components/VirtualLeadList";
import { isFeatureEnabled } from "../lib/featureFlags";

export function AdminPage() {
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const showAdminInsights = isFeatureEnabled("adminInsights");
  const leadsQuery = useQuery({
    queryFn: getAdminLeads,
    queryKey: ["admin", "leads"],
  });

  useEffect(() => {
    if (leadsQuery.isError) {
      notification.error({
        description: "Start FastAPI on port 8001 and log in with an admin token.",
        title: "Admin API unavailable",
      });
    }
  }, [leadsQuery.isError]);

  const columns = useMemo<ColumnsType<AdminLead>>(
    () => [
      {
        dataIndex: "name",
        title: "Lead",
      },
      {
        dataIndex: "email",
        title: "Email",
      },
      {
        dataIndex: "product_name",
        render: (productName: string | null) => productName ?? "Unassigned",
        title: "Product",
      },
      {
        dataIndex: "created_at",
        render: (value: string) => new Date(value).toLocaleString(),
        title: "Created",
      },
      {
        render: (_, lead) => (
          <Button type="link" onClick={() => setSelectedLead(lead)}>
            View
          </Button>
        ),
        title: "Action",
      },
    ],
    [],
  );

  if (leadsQuery.isError) {
    return (
      <section className="page-section">
        <Result
          status="warning"
          title="Admin API unavailable"
          subTitle="Start FastAPI on port 8001 and log in with an admin token."
        />
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="section-heading">
        <span className="eyebrow">Admin</span>
        <h1>Lead console</h1>
        <p>Protected by JWT and the admin role.</p>
      </div>

      <SurfaceCard>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="m-0 text-2xl font-extrabold">预约线索</h2>
            <p className="m-0 text-sm text-muted">Only admin users can read this table.</p>
          </div>
          <StatusBadge tone="accent">admin only</StatusBadge>
        </div>

        {leadsQuery.isLoading ? (
          <AdminTableSkeleton />
        ) : (
          <>
            {showAdminInsights && <AdminInsights leads={leadsQuery.data ?? []} />}
            <section className="activity-panel" aria-labelledby="lead-activity-title">
              <h3 id="lead-activity-title">Lead activity</h3>
              <VirtualLeadList leads={leadsQuery.data ?? []} />
            </section>
            <Table<AdminLead>
              columns={columns}
              dataSource={leadsQuery.data ?? []}
              locale={{ emptyText: "No leads yet" }}
              pagination={{ pageSize: 5 }}
              rowKey="id"
              scroll={{ x: true }}
            />
          </>
        )}
      </SurfaceCard>

      <Modal
        open={Boolean(selectedLead)}
        title={selectedLead?.name}
        footer={<Button onClick={() => setSelectedLead(null)}>Close</Button>}
        onCancel={() => setSelectedLead(null)}
      >
        {selectedLead && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Email">{selectedLead.email}</Descriptions.Item>
            <Descriptions.Item label="Company">{selectedLead.company ?? "None"}</Descriptions.Item>
            <Descriptions.Item label="Role">{selectedLead.role ?? "None"}</Descriptions.Item>
            <Descriptions.Item label="Product">
              {selectedLead.product_name ?? selectedLead.product_id ?? "Unassigned"}
            </Descriptions.Item>
            <Descriptions.Item label="Message">{selectedLead.message ?? "None"}</Descriptions.Item>
            <Descriptions.Item label="Configuration">
              <pre className="m-0 whitespace-pre-wrap text-xs">
                {JSON.stringify(selectedLead.configuration, null, 2)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </section>
  );
}
