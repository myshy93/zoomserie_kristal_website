// Cookie consent, stored in localStorage. Only one optional category for now:
// `media` = third-party embeds that set cookies (Google Maps; later the Instagram feed).
// Add `analytics` here when GA4 is wired up, not before: the banner lists every category.

export type ConsentCategory = 'media';

export interface Consent {
  v: 1;
  media: boolean;
  /** When the visitor last chose, ISO string. */
  ts: string;
}

const STORAGE_KEY = 'zoomserie.consent.v1';
const CHANGE_EVENT = 'consent:change';

/** The stored choice, or null if the visitor hasn't chosen yet (or storage is blocked). */
export function getConsent(): Consent | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return parsed?.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  return getConsent()?.[category] === true;
}

/** Merges into the stored choice; categories never chosen default to denied. */
export function setConsent(choice: Partial<Record<ConsentCategory, boolean>>): void {
  const consent: Consent = { v: 1, media: false, ...getConsent(), ...choice, ts: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked: the choice still applies to this page view via the event below.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: consent }));
}

/** Runs `run` now if the category is already granted, otherwise as soon as it is. */
export function onConsent(category: ConsentCategory, run: () => void): void {
  if (hasConsent(category)) return run();
  const listener = (e: Event) => {
    if ((e as CustomEvent<Consent>).detail[category]) {
      window.removeEventListener(CHANGE_EVENT, listener);
      run();
    }
  };
  window.addEventListener(CHANGE_EVENT, listener);
}

