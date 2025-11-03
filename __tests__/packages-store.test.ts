import { act } from '@testing-library/react-native';
import { usePackagesStore } from '@/stores/packagesStore';
import { fetchPackages as realFetchPackages } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  fetchPackages: jest.fn(),
}));

const fetchPackages = jest.mocked(realFetchPackages);

const basePackage = {
  id: 1,
  sender_id: 1,
  receiver_id: 2,
  current_location: 'warehouse',
  status: 'in_transit',
  assigned_truck_id: null,
  expected_temperature_min: 2,
  expected_temperature_max: 8,
  expected_humidity_min: 30,
  expected_humidity_max: 60,
  created_at: '2024-01-01',
  updated_at: null,
  sender_name: 'Sender',
  receiver_name: 'Receiver',
};

describe('usePackagesStore fetchNow', () => {
  beforeEach(() => {
    usePackagesStore.setState({
      packages: [],
      lastUpdated: null,
      loading: false,
      error: null,
    });
    fetchPackages.mockReset();
  });

  it('filters out delivered packages and records the timestamp on success', async () => {
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    fetchPackages.mockResolvedValue([
      { ...basePackage, id: 1, status: 'IN_TRANSIT' },
      { ...basePackage, id: 2, status: 'delivered' },
    ]);

    await act(async () => {
      await usePackagesStore.getState().fetchNow();
    });

    const state = usePackagesStore.getState();
    expect(state.packages).toEqual([{ ...basePackage, id: 1, status: 'IN_TRANSIT' }]);
    expect(state.lastUpdated).toBe(now);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    (Date.now as jest.Mock).mockRestore();
  });

  it('captures the error message when fetching fails', async () => {
    fetchPackages.mockRejectedValue(new Error('network down'));

    await act(async () => {
      await usePackagesStore.getState().fetchNow();
    });

    const state = usePackagesStore.getState();
    expect(state.loading).toBe(false);
    expect(state.packages).toEqual([]);
    expect(state.error).toBe('network down');
  });
});

