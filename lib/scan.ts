import { z } from 'zod';

export type ParsedScanPayload = {
  packageId?: string;
  recipient?: string;
  address?: string;
  notes?: string;
  temperatureC?: number;
  humidity?: number;
  raw: string;
};

// Allow number-like strings to become numbers
const numberLike = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  }
  return value;
}, z.number());

// Accept alias keys from various QR payload variants
const RawScanSchema = z
  .object({
    packageId: z.union([z.string(), z.number()]).optional(),
    id: z.union([z.string(), z.number()]).optional(),
    recipient: z.string().optional(),
    customer: z.string().optional(),
    address: z.string().optional(),
    destination: z.string().optional(),
    notes: z.string().optional(),
    temperatureC: numberLike.optional(),
    temperature: numberLike.optional(),
    humidity: numberLike.optional(),
    rh: numberLike.optional(),
  })
  .passthrough();

export function parseScannedPayload(raw: string): ParsedScanPayload {
  if (!raw) return { raw };
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return { raw };

    const parsed = RawScanSchema.safeParse(obj);
    if (!parsed.success) return { raw };
    const v = parsed.data;

    const packageIdVal = v.packageId ?? v.id;
    const recipientVal = v.recipient ?? v.customer;
    const addressVal = v.address ?? v.destination;
    const temperatureVal =
      typeof v.temperatureC === 'number' ? v.temperatureC : typeof v.temperature === 'number' ? v.temperature : undefined;
    const humidityVal =
      typeof v.humidity === 'number' ? v.humidity : typeof v.rh === 'number' ? v.rh : undefined;

    return {
      packageId: typeof packageIdVal === 'number' ? String(packageIdVal) : packageIdVal,
      recipient: recipientVal,
      address: addressVal,
      notes: v.notes,
      temperatureC: temperatureVal,
      humidity: humidityVal,
      raw,
    };
  } catch {
    return { raw };
  }
}
