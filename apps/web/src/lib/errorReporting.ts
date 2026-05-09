import { redactSensitiveData, redactText, type RedactableValue } from "./privacyRedaction";

export type ClientErrorReport = {
  context: Record<string, RedactableValue>;
  message: string;
  name: string;
  timestamp: string;
};

export type ErrorMonitoringAdapter = {
  captureError: (report: ClientErrorReport) => void | Promise<void>;
};

export function createMemoryErrorMonitoringAdapter() {
  const reports: ClientErrorReport[] = [];
  return {
    adapter: {
      captureError: (report: ClientErrorReport) => {
        reports.push(report);
      },
    } satisfies ErrorMonitoringAdapter,
    clear: () => {
      reports.length = 0;
    },
    getReports: () => [...reports],
  };
}

const memoryErrorMonitoring = createMemoryErrorMonitoringAdapter();
let errorMonitoringAdapter: ErrorMonitoringAdapter = memoryErrorMonitoring.adapter;

export function setErrorMonitoringAdapter(adapter: ErrorMonitoringAdapter) {
  errorMonitoringAdapter = adapter;
}

export function resetErrorMonitoringAdapter() {
  errorMonitoringAdapter = memoryErrorMonitoring.adapter;
}

export function reportClientError(error: Error, context: Record<string, RedactableValue> = {}) {
  const report: ClientErrorReport = {
    context: redactSensitiveData(context),
    message: redactText(error.message),
    name: error.name,
    timestamp: new Date().toISOString(),
  };
  void errorMonitoringAdapter.captureError(report);
  return report;
}

export function getClientErrorReports() {
  return memoryErrorMonitoring.getReports();
}

export function clearClientErrorReports() {
  memoryErrorMonitoring.clear();
  resetErrorMonitoringAdapter();
}
