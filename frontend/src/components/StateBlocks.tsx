import { EmptyState as SharedEmptyState } from "@lumadock/ui";
import { Skeleton } from "antd";
import { AlertCircle, Loader2, SearchX } from "lucide-react";

type StateBlockProps = {
  title: string;
  message: string;
};

export function LoadingState({
  title = "Loading",
  message = "Fetching fresh data.",
}: Partial<StateBlockProps>) {
  return (
    <div className="state-block skeleton-state" role="status">
      <Loader2 className="state-icon spin" size={24} aria-hidden="true" />
      <strong>{title}</strong>
      <span>{message}</span>
      <Skeleton active paragraph={{ rows: 1 }} title={false} />
    </div>
  );
}

export function ErrorState({ title, message }: StateBlockProps) {
  return (
    <div className="state-block state-block-error" role="alert">
      <AlertCircle className="state-icon" size={24} aria-hidden="true" />
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({ title, message }: StateBlockProps) {
  return (
    <SharedEmptyState
      title={title}
      message={message}
      style={{ minHeight: 120, textAlign: "left" }}
    />
  );
}

export function LegacyEmptyState({ title, message }: StateBlockProps) {
  return (
    <div className="state-block">
      <SearchX className="state-icon" size={24} aria-hidden="true" />
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
