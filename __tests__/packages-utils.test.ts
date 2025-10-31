import { isHumInRange, isTempInRange } from "@/stores/packagesStore";
import type { ApiPackage } from "@/lib/api";

const makePackage = (overrides: Partial<ApiPackage>): ApiPackage =>
  ({
    id: 1,
    sender_id: 1,
    receiver_id: 2,
    current_location: "warehouse",
    status: "in_transit",
    assigned_truck_id: null,
    expected_temperature_min: 2,
    expected_temperature_max: 8,
    expected_humidity_min: 30,
    expected_humidity_max: 60,
    created_at: "2024-01-01",
    updated_at: null,
    sender_name: "Sender",
    receiver_name: "Receiver",
    current_temperature: null,
    current_humidity: null,
    last_sensor_at: null,
    driver_position: null,
    ...overrides,
  }) as ApiPackage;

describe("isTempInRange", () => {
  it("returns true when current temperature sits within the bounds", () => {
    const pkg = makePackage({ current_temperature: 5 });
    expect(isTempInRange(pkg)).toBe(true);
  });

  it("returns false when temperature is missing or out of range", () => {
    expect(isTempInRange(makePackage({ current_temperature: undefined }))).toBe(false);
    expect(isTempInRange(makePackage({ current_temperature: 10 }))).toBe(false);
    expect(isTempInRange(makePackage({ current_temperature: -5 }))).toBe(false);
  });
});

describe("isHumInRange", () => {
  it("returns true when humidity falls within the allowed range", () => {
    const pkg = makePackage({ current_humidity: 45 });
    expect(isHumInRange(pkg)).toBe(true);
  });

  it("returns false when humidity is missing or outside the range", () => {
    expect(isHumInRange(makePackage({ current_humidity: undefined }))).toBe(false);
    expect(isHumInRange(makePackage({ current_humidity: 10 }))).toBe(false);
    expect(isHumInRange(makePackage({ current_humidity: 90 }))).toBe(false);
  });
});
