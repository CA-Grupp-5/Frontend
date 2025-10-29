import { parseScannedPayload } from '@/lib/scan';

describe('parseScannedPayload', () => {
  it('returns raw when input is empty or non-JSON', () => {
    expect(parseScannedPayload('')).toEqual({ raw: '' });

    const raw = 'NOT_JSON';
    expect(parseScannedPayload(raw)).toEqual({ raw });
  });

  it('extracts packageId and senderName', () => {
    const raw = JSON.stringify({
      packageId: 'PKG-123',
      senderName: 'Giorgio',
    });

    expect(parseScannedPayload(raw)).toEqual({
      packageId: 'PKG-123',
      senderName: 'Giorgio',
      raw,
    });
  });

  it('coerces numeric packageId to string and ignores extra fields', () => {
    const raw = JSON.stringify({
      packageId: 45,
      senderName: 'Space Y',
      extra: { note: 'ignored' },
    });

    expect(parseScannedPayload(raw)).toEqual({
      packageId: '45',
      senderName: 'Space Y',
      raw,
    });
  });

  it('falls back to raw when schema validation fails', () => {
    const raw = JSON.stringify({
      sender: 'Missing packageId',
    });

    expect(parseScannedPayload(raw)).toEqual({ raw });
  });
});
