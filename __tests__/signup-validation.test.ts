import { signupSchema } from '@/lib/authValidation';

describe('signupSchema', () => {
  it('accepts valid signup details for an allowed email domain', () => {
    const result = signupSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane.doe@postnord.se',
      password: 'SecurePass1',
      rememberMe: false,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Jane Doe');
    }
  });

  it('rejects signup when the password fails validation', () => {
    const result = signupSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane.doe@postnord.se',
      password: 'password1',
      rememberMe: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain('Password must contain at least one uppercase letter');
    }
  });

  it('rejects signup when the email domain is not allowed', () => {
    const result = signupSchema.safeParse({
      name: 'Jane Doe',
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

