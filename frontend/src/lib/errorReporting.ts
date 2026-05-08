import { redactSensitiveData, redactText, type RedactableValue } from "./privacyRedaction";

export type ClientErrorReport = {
  context: Record<string, RedactableValue>;
  message: string;
  name: string;
  timestamp: string;
};

const clientErrorReports: ClientErrorReport[] = [];

export function reportClientError(error: Error, context: Record<string, RedactableValue> = {}) {
  const report: ClientErrorReport = {
    context: redactSensitiveData(context),
    message: redactText(error.message),
    name: error.name,
    timestamp: new Date().toISOString(),
  };
  clientErrorReports.push(report);
  return report;
}

export function getClientErrorReports() {
  return [...clientErrorReports];
}

export function clearClientErrorReports() {
  clientErrorReports.length = 0;
}
