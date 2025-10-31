import { capitalizeFirstLetter, formatPackageId } from "@/lib/utils";

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first character and leaves the rest untouched", () => {
    expect(capitalizeFirstLetter("cold chain")).toBe("Cold chain");
  });

  it("returns an empty string when input is empty", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });
});

describe("formatPackageId", () => {
  it("returns null for nullish or empty input", () => {
    expect(formatPackageId(undefined)).toBeNull();
    expect(formatPackageId(null)).toBeNull();
    expect(formatPackageId("   ")).toBeNull();
  });

  it("preserves IDs that already include the PKG prefix", () => {
    expect(formatPackageId("PKG-123")).toBe("PKG-123");
    expect(formatPackageId("pkg-456")).toBe("pkg-456");
  });

  it("adds the PKG prefix to raw identifiers", () => {
    expect(formatPackageId("789")).toBe("PKG-789");
  });
});
