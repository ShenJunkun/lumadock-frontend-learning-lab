import { Button, Result } from "antd";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  compact?: boolean;
  resetKey?: string;
  title?: string;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("LumaDock render failure", error, errorInfo);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className={this.props.compact ? "error-boundary compact" : "error-boundary"}>
        <Result
          status="error"
          title={this.props.title ?? "Something went wrong"}
          subTitle="This section recovered instead of leaving the page blank."
          extra={
            <Button type="primary" onClick={this.reset}>
              Try again
            </Button>
          }
        />
      </div>
    );
  }
}
