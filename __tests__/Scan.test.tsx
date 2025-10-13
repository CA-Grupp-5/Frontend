import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import ScanScreen from '@/app/(tabs)/scan';

type CameraProps = {
  onCameraReady?: () => void;
  onBarcodeScanned?: (e: { data: string }) => void;
};
let mockCameraProps: CameraProps = {};
jest.mock('expo-camera', () => ({
  CameraView: (props: CameraProps) => {
    mockCameraProps = props;
    return null;
  },
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true,
  useFocusEffect: (_cb: () => void) => {},
}));

jest.mock('nativewind', () => ({
  useColorScheme: () => ({ colorScheme: 'light' }),
}));

// Mock the result sheet to a lightweight mock function
jest.mock('@/components/ScanResultSheet', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

// Silence vector icons reanimated updates
jest.mock('@expo/vector-icons/FontAwesome', () => () => null);

describe('ScanScreen', () => {
  it('renders the scan header when permission is granted', async () => {
    const { getByText } = render(<ScanScreen />);
    expect(getByText('Scan package QR')).toBeTruthy();
  });

  it('opens the result sheet after a successful QR scan', async () => {
    render(<ScanScreen />);

    // Ensure camera becomes ready to enable scanning
    expect(mockCameraProps?.onCameraReady).toBeInstanceOf(Function);
    await act(async () => {
      mockCameraProps.onCameraReady?.();
    });

    // Trigger a fake QR scan event
    const mockQrData = 'HELLO_QR';
    await waitFor(() => expect(mockCameraProps?.onBarcodeScanned).toBeInstanceOf(Function));
    await act(async () => {
      mockCameraProps.onBarcodeScanned?.({ data: mockQrData });
    });

    // Assert that the ScanResultSheet was rendered with visible=true
    const SheetMock = require('@/components/ScanResultSheet').default as jest.Mock;
    await waitFor(() => {
      expect(SheetMock).toHaveBeenCalled();
      const lastProps = SheetMock.mock.calls[SheetMock.mock.calls.length - 1][0];
      expect(lastProps.visible).toBe(true);
      expect(lastProps.payload?.raw).toBe(mockQrData);
    });
  });
});
