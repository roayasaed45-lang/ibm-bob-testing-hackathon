import { describe, it, expect } from 'vitest';
import {
  normalizePhone,
  phoneToSyntheticEmail,
  SYNTHETIC_EMAIL_DOMAIN,
} from '@/lib/phoneUtils';

// ---------------------------------------------------------------------------
// T1 — normalizePhone: international +972 format → local 0-prefix
// ---------------------------------------------------------------------------
describe('normalizePhone — international → local', () => {
  it('strips + and converts 972 prefix to 0 (T1)', () => {
    expect(normalizePhone('+972501234567')).toBe('0501234567');
  });

  it('handles 972 without + sign', () => {
    expect(normalizePhone('972501234567')).toBe('0501234567');
  });

  it('handles spaces inside the number', () => {
    // e.g. "+972 50 123 4567" as typed by a user
    expect(normalizePhone('+972 50 123 4567')).toBe('0501234567');
  });

  it('handles dashes inside the number', () => {
    expect(normalizePhone('+972-50-123-4567')).toBe('0501234567');
  });
});

// ---------------------------------------------------------------------------
// T2 — normalizePhone: already-local format is unchanged (idempotency)
// ---------------------------------------------------------------------------
describe('normalizePhone — local format is idempotent', () => {
  it('leaves 0501234567 unchanged (T2)', () => {
    expect(normalizePhone('0501234567')).toBe('0501234567');
  });

  it('is idempotent — normalizing an already-normalized value gives the same result', () => {
    const once = normalizePhone('+972501234567');
    const twice = normalizePhone(once);
    expect(twice).toBe(once);
  });
});

// ---------------------------------------------------------------------------
// T3 — phoneToSyntheticEmail: domain and format contract
// ---------------------------------------------------------------------------
describe('phoneToSyntheticEmail — email derivation', () => {
  it('appends the correct domain (T3)', () => {
    const email = phoneToSyntheticEmail('0501234567');
    expect(email).toBe('0501234567@customers.alebarber.internal');
  });

  it('uses the exported SYNTHETIC_EMAIL_DOMAIN constant — not a hardcoded string', () => {
    const email = phoneToSyntheticEmail('0501234567');
    expect(email).toContain(SYNTHETIC_EMAIL_DOMAIN);
  });
});

// ---------------------------------------------------------------------------
// T7 — Cross-format parity: +972 and 05X produce the SAME synthetic email
// (the highest-risk real-world bug — phone registered with one format,
//  login attempted with the other)
// ---------------------------------------------------------------------------
describe('cross-format parity (T7)', () => {
  it('+972501234567 and 0501234567 produce the same synthetic email', () => {
    const emailFromInternational = phoneToSyntheticEmail(
      normalizePhone('+972501234567'),
    );
    const emailFromLocal = phoneToSyntheticEmail(normalizePhone('0501234567'));

    expect(emailFromInternational).toBe(emailFromLocal);
  });

  it('972 (no plus) and 0 prefix also produce the same email', () => {
    const emailFromInternational = phoneToSyntheticEmail(
      normalizePhone('972501234567'),
    );
    const emailFromLocal = phoneToSyntheticEmail(normalizePhone('0501234567'));

    expect(emailFromInternational).toBe(emailFromLocal);
  });

  it('formatted international (+972 with spaces) also resolves to the same email', () => {
    const emailFormatted = phoneToSyntheticEmail(
      normalizePhone('+972 50 123 4567'),
    );
    const emailPlain = phoneToSyntheticEmail(normalizePhone('0501234567'));

    expect(emailFormatted).toBe(emailPlain);
  });
});
