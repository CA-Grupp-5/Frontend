import { z } from 'zod';
import allowedDomainsJson from '@/allowedDomains.json';

const allowedDomains = (allowedDomainsJson.domains ?? []) as string[];
const allowedDomainSet = new Set(allowedDomains.map((domain) => domain.toLowerCase()));

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address')
  .refine((value) => {
    const domain = value.split('@')[1]?.toLowerCase();
    return Boolean(domain && allowedDomainSet.has(domain));
  }, 'Email domain is not allowed. Please use an approved company email.');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number');

const baseSchema = z.object({
  name: z.string().trim().optional(),
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().default(false),
});

export const loginSchema = baseSchema;

export const signupSchema = baseSchema.extend({
  name: z.string().trim().min(1, 'Full name is required'),
});

export type AuthFormValues = z.infer<typeof baseSchema>;
