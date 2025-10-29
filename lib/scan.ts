import { z } from 'zod';

export type ParsedScanPayload = {
  packageId?: string;
  senderName?: string;
  raw: string;
};

const ScanPayloadSchema = z
  .object({
    packageId: z.union([z.string(), z.number()]).optional(),
    senderName: z.string().optional(),
  })
  .passthrough();

export function parseScannedPayload(raw: string): ParsedScanPayload {
  if (!raw) return { raw };
  try {
    const obj = JSON.parse(raw);
    const parsed = ScanPayloadSchema.safeParse(obj);
    if (!parsed.success) return { raw };
    const value = parsed.data;

    return {
      packageId: typeof value.packageId === 'number' ? String(value.packageId) : value.packageId,
      senderName: value.senderName,
      raw,
    };
  } catch {
    return { raw };
  }
}
