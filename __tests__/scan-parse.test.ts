import { parseScannedPayload } from '@/lib/scan';

describe('parseScannedPayload', () => {
  it('returns raw when input is empty or non-JSON', () => {
    expect(parseScannedPayload('')).toEqual({ raw: '' });
    const raw = 'JUST_A_STRING';
    expect(parseScannedPayload(raw)).toEqual({ raw });
  });

  it('parses canonical fields', () => {
    const raw = JSON.stringify({
      packageId: 'PKG-1001',
      recipient: 'Alice',
      address: '123 Main',
      notes: 'Leave at door',
      temperatureC: 7.5,
      humidity: 55,
    });
    const parsed = parseScannedPayload(raw);
    expect(parsed).toMatchObject({
      packageId: 'PKG-1001',
      recipient: 'Alice',
      address: '123 Main',
      notes: 'Leave at door',
      temperatureC: 7.5,
      humidity: 55,
      raw,
    });
  });

  it('parses alias fields and coerces id to string', () => {
    const raw = JSON.stringify({
      id: 42,
      customer: 'Bob',
      destination: 'Warehouse 9',
      temperature: '4.2',
      rh: '63',
    });
    const parsed = parseScannedPayload(raw);
    expect(parsed.packageId).toBe('42');
    expect(parsed.recipient).toBe('Bob');
    expect(parsed.address).toBe('Warehouse 9');
    expect(parsed.temperatureC).toBeCloseTo(4.2);
    expect(parsed.humidity).toBeCloseTo(63);
    expect(parsed.raw).toBe(raw);
  });

  it('handles partial payloads gracefully', () => {
    const raw = JSON.stringify({ id: 'PKG-77' });
    const parsed = parseScannedPayload(raw);
    expect(parsed.packageId).toBe('PKG-77');
    expect(parsed.recipient).toBeUndefined();
    expect(parsed.address).toBeUndefined();
    expect(parsed.temperatureC).toBeUndefined();
    expect(parsed.humidity).toBeUndefined();
  });
});

