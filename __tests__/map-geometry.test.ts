import { computeBoundsFromRoute, expandBoundsAround } from '@/lib/map-geometry';

describe('computeBoundsFromRoute', () => {
  it('returns null when the route has fewer than two points', () => {
    const result = computeBoundsFromRoute({ type: 'LineString', coordinates: [[12, 55]] });
    expect(result).toBeNull();
  });

  it('returns the northeast and southwest corners for a valid route', () => {
    const result = computeBoundsFromRoute({
      type: 'LineString',
      coordinates: [
        [12.1, 55.2],
        [12.5, 55.4],
        [12.0, 55.1],
      ],
    });

    expect(result).toEqual({
      ne: [12.5, 55.4],
      sw: [12.0, 55.1],
    });
  });
});

describe('expandBoundsAround', () => {
  it('expands bounds by the given offsets', () => {
    const result = expandBoundsAround([12, 55], 0.5, 0.25);

    expect(result).toEqual({
      ne: [12.5, 55.25],
      sw: [11.5, 54.75],
    });
  });

  it('handles negative offsets', () => {
    const result = expandBoundsAround([0, 0], -0.1, -0.2);

    expect(result).toEqual({
      ne: [-0.1, -0.2],
      sw: [0.1, 0.2],
    });
  });
});

