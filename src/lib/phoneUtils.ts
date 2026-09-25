/**
 * Phone normalization utilities shared between CustomerAuthContext and tests.
 *
 * Canonical local format: strip everything but digits, then convert a
 * 972-prefixed number to the local 0-prefixed form.
 * Do not diverge from this — profiles.phone and the synthetic email both
 * depend on getting the same string every time.
 */
export const normalizePhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.startsWith('972')) {
    return `0${cleaned.substring(3)}`;
  }
  return cleaned;
};

/**
 * The customer only ever sees/enters phone + password. Supabase Auth still
 * needs an email under the hood (no SMS provider is configured for native
 * phone auth), so we derive one deterministically from the normalized phone.
 * Same input always produces the same email, so signUp and signIn resolve
 * to the same Auth user.
 */
export const SYNTHETIC_EMAIL_DOMAIN = 'customers.alebarber.internal';

export const phoneToSyntheticEmail = (normalizedPhone: string): string =>
  `${normalizedPhone}@${SYNTHETIC_EMAIL_DOMAIN}`;
