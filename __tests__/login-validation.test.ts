import { loginSchema } from '@/lib/authValidation';

describe('loginSchema', () => {
  it('accepts valid credentials for an allowed domain', () => {
    const result = loginSchema.safeParse({
      email: 'jane.doe@postnord.se',
      password: 'SecurePass1',
      rememberMe: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('jane.doe@postnord.se');
    }
  });

  it('rejects credentials when the password fails validation', () => {
    const result = loginSchema.safeParse({
      email: 'jane.doe@postnord.se',
      password: 'weakpass',
      rememberMe: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain('Password must contain at least one uppercase letter');
    }
  });

  it('rejects credentials from a disallowed email domain', () => {
    const result = loginSchema.safeParse({
      email: 'jane.doe@gmail.com',
      password: 'SecurePass1',
      rememberMe: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain('Email domain is not allowed. Please use an approved company email.');
    }
  });
});

