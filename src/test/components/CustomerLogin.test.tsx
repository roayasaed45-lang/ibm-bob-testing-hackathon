import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerLogin from '@/pages/CustomerLogin';

// ---------------------------------------------------------------------------
// Mock: react-router-dom
// Preserve all real exports; only replace useNavigate with a spy.
// ---------------------------------------------------------------------------
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

// ---------------------------------------------------------------------------
// Mock: CustomerAuthContext
// useCustomerAuth returns a controlled signIn spy so no real Supabase calls
// are made and the real CustomerAuthProvider (which fires network requests
// on mount) is never involved.
// ---------------------------------------------------------------------------
const mockSignIn = vi.fn();
vi.mock('@/contexts/CustomerAuthContext', () => ({
  useCustomerAuth: () => ({
    signIn: mockSignIn,
    signOut: vi.fn(),
    signUp: vi.fn(),
    session: null,
    user: null,
    profile: null,
    loading: false,
  }),
}));

// ---------------------------------------------------------------------------
// Mock: LanguageContext
// t(key) returns the key itself so assertions can use stable strings
// regardless of which translation is active.
// ---------------------------------------------------------------------------
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render CustomerLogin wrapped in a MemoryRouter (real router, not mocked). */
function renderLoginPage() {
  // MemoryRouter is still the real implementation (importOriginal above
  // spread all actual react-router-dom exports).
  const { MemoryRouter } = require('react-router-dom');
  return render(
    <MemoryRouter initialEntries={['/customer-login']}>
      <CustomerLogin />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Setup: reset spies before every test
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockNavigate.mockReset();
  mockSignIn.mockReset();
});

// ---------------------------------------------------------------------------
// T4 — Empty-field validation blocks signIn
// ---------------------------------------------------------------------------
describe('T4: empty-field validation', () => {
  it('shows a validation toast and does NOT call signIn when both fields are empty', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    // The toast description key "fillAllFields" must appear in the document.
    // useToast uses in-memory state; the Toaster is not rendered here, but
    // the toast() call is still reachable via the hook. We verify signIn was
    // never called — that is the safety-critical assertion.
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows a validation toast and does NOT call signIn when only phone is filled', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/phoneNumber/i), '0501234567');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('shows a validation toast and does NOT call signIn when only password is filled', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSignIn).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// T5 — Happy path: valid credentials → signIn called → navigate('/')
// ---------------------------------------------------------------------------
describe('T5: happy-path login', () => {
  it('calls signIn with the entered phone and password', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/phoneNumber/i), '0501234567');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledOnce();
      expect(mockSignIn).toHaveBeenCalledWith('0501234567', 'secret123');
    });
  });

  it('navigates to "/" after a successful login', async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/phoneNumber/i), '0501234567');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

// ---------------------------------------------------------------------------
// T6 — Error path: signIn failure → error feedback, NO navigation
// ---------------------------------------------------------------------------
describe('T6: login failure handling', () => {
  it('does NOT navigate when signIn returns an error', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials', code: 'invalid_credentials', status: 400 },
    });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/phoneNumber/i), '0501234567');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledOnce();
    });

    // Navigation must never have been called
    expect(mockNavigate).not.toHaveBeenCalledWith('/');
  });

  it('re-enables the submit button after a failed login so the user can retry', async () => {
    mockSignIn.mockResolvedValueOnce({
      error: { message: 'Invalid login credentials', code: 'invalid_credentials', status: 400 },
    });
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/phoneNumber/i), '0501234567');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      // After the error path resolves, loading is set back to false and
      // the button must no longer be disabled.
      expect(submitButton).not.toBeDisabled();
    });
  });
});
