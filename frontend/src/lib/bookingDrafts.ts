import type { LeadFormValues } from "../components/leadFormSchema";

const bookingDraftPrefix = "lumadock.bookingDraft";

type StoredBookingDraft = LeadFormValues & {
  updatedAt: string;
};

function getStorage(storage?: Storage) {
  return storage ?? window.sessionStorage;
}

export function getBookingDraftKey(productId?: string) {
  return `${bookingDraftPrefix}:${productId?.trim() || "unknown"}`;
}

export function createEmptyLeadFormValues(productId?: string): LeadFormValues {
  return {
    productId,
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
    consent: false,
  };
}

function normalizeLeadFormValues(
  productId: string | undefined,
  values: Partial<LeadFormValues>,
): LeadFormValues {
  return {
    ...createEmptyLeadFormValues(productId),
    ...values,
    productId,
  };
}

function isEmptyDraft(values: LeadFormValues) {
  return (
    !values.name.trim() &&
    !values.email.trim() &&
    !values.company?.trim() &&
    !values.role?.trim() &&
    !values.message?.trim() &&
    !values.consent
  );
}

export function readBookingDraft(productId?: string, storage?: Storage): LeadFormValues | null {
  const draft = getStorage(storage).getItem(getBookingDraftKey(productId));
  if (!draft) {
    return null;
  }

  try {
    const parsed = JSON.parse(draft) as Partial<StoredBookingDraft>;
    return normalizeLeadFormValues(productId, parsed);
  } catch {
    getStorage(storage).removeItem(getBookingDraftKey(productId));
    return null;
  }
}

export function getLeadFormDefaultValues(productId?: string, storage?: Storage): LeadFormValues {
  return readBookingDraft(productId, storage) ?? createEmptyLeadFormValues(productId);
}

export function writeBookingDraft(
  productId: string | undefined,
  values: Partial<LeadFormValues>,
  storage?: Storage,
) {
  const normalizedValues = normalizeLeadFormValues(productId, values);
  const draftStorage = getStorage(storage);
  const key = getBookingDraftKey(productId);

  if (isEmptyDraft(normalizedValues)) {
    draftStorage.removeItem(key);
    return;
  }

  const storedDraft: StoredBookingDraft = {
    ...normalizedValues,
    updatedAt: new Date().toISOString(),
  };
  draftStorage.setItem(key, JSON.stringify(storedDraft));
}

export function clearBookingDraft(productId?: string, storage?: Storage) {
  getStorage(storage).removeItem(getBookingDraftKey(productId));
}
