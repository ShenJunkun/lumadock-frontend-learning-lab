import { Button, Modal, Result, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

type PreviewLead = {
  key: string;
  name: string;
  product: string;
  status: "new" | "qualified" | "scheduled";
};

const previewLeads: PreviewLead[] = [
  {
    key: "1",
    name: "Ada Lovelace",
    product: "LumaDock Studio",
    status: "new",
  },
  {
    key: "2",
    name: "Grace Hopper",
    product: "LumaDock Max",
    status: "scheduled",
  },
];

const columns: ColumnsType<PreviewLead> = [
  {
    dataIndex: "name",
    title: "Lead",
  },
  {
    dataIndex: "product",
    title: "Product",
  },
  {
    dataIndex: "status",
    render: (status: PreviewLead["status"]) => {
      const color = status === "new" ? "cyan" : status === "qualified" ? "blue" : "green";
      return <Tag color={color}>{status}</Tag>;
    },
    title: "Status",
  },
];

export function AntdWorkbenchPreview() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mt-8 rounded-ui border border-line bg-surface p-4 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="eyebrow">Ant Design</span>
          <h2 className="m-0 text-2xl font-extrabold leading-tight">Component workbench</h2>
        </div>
        <Button type="primary" onClick={() => setIsOpen(true)}>
          Open modal
        </Button>
      </div>

      <Table<PreviewLead>
        columns={columns}
        dataSource={previewLeads}
        pagination={false}
        scroll={{ x: true }}
        size="middle"
      />

      <Modal
        open={isOpen}
        title="Admin workflow preview"
        okText="Got it"
        onCancel={() => setIsOpen(false)}
        onOk={() => setIsOpen(false)}
      >
        <Result
          status="success"
          title="Antd is wired into the app shell"
          subTitle="The real admin table will reuse this theme, modal, and table pattern."
        />
      </Modal>
    </section>
  );
}
