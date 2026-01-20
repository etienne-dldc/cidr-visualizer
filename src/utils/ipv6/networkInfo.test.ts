import { describe, expect, it } from "vitest";
import { calculateIPv6NetworkInfo } from "./networkInfo";

describe("calculateIPv6NetworkInfo - RFC 4291", () => {
  describe("Standard subnet calculations", () => {
    it("should calculate network info for /64 subnet", () => {
      const result = calculateIPv6NetworkInfo([
        0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 0, 64,
      ]);
      expect(result.mode).toBe("IPv6");
      expect(result.baseIP).toEqual([
        0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 0,
      ]);
      expect(result.broadcastIP).toBeNull(); // IPv6 has no broadcast
      expect(result.firstUsableIP).toEqual([
        0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 1,
      ]);
      expect(result.lastUsableIP).toEqual([
        0x2001, 0x0db8, 0x1234, 0x5678, 0xffff, 0xffff, 0xffff, 0xffff,
      ]);
    });

    it("should calculate network info for /32 subnet", () => {
      const result = calculateIPv6NetworkInfo([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 32,
      ]);
      expect(result.baseIP).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0]);
      expect(result.broadcastIP).toBeNull();
    });
  });

  describe("RFC 3849 - Documentation prefix", () => {
    it("should calculate network info for 2001:db8::/32", () => {
      const result = calculateIPv6NetworkInfo([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 32,
      ]);
      expect(result.baseIP).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe("RFC 4193 - ULA", () => {
    it("should calculate network info for fd00::/8", () => {
      const result = calculateIPv6NetworkInfo([0xfd00, 0, 0, 0, 0, 0, 0, 0, 8]);
      expect(result.baseIP).toEqual([0xfd00, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe("Edge case: /128 (single host)", () => {
    it("should handle /128 prefix with no usable IPs", () => {
      const result = calculateIPv6NetworkInfo([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 128,
      ]);
      expect(result.baseIP).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 1]);
      expect(result.broadcastIP).toBeNull();
      expect(result.firstUsableIP).toBeNull();
      expect(result.lastUsableIP).toBeNull();
      expect(result.count).toBe(1n);
    });
  });

  describe("Edge case: /127 (point-to-point)", () => {
    it("should handle /127 prefix with both addresses usable", () => {
      const result = calculateIPv6NetworkInfo([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 127,
      ]);
      expect(result.baseIP).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0]);
      expect(result.broadcastIP).toBeNull();
      expect(result.firstUsableIP).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0]);
      expect(result.lastUsableIP).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 1]);
      expect(result.count).toBe(2n);
    });
  });

  describe("Edge case: /0 (entire IPv6 space)", () => {
    it("should handle /0 prefix", () => {
      const result = calculateIPv6NetworkInfo([0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.baseIP).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(result.broadcastIP).toBeNull();
      expect(result.count).toBe(2n ** 128n);
    });
  });

  describe("Network address calculation with host bits set", () => {
    it("should zero host bits when calculating network address", () => {
      const result = calculateIPv6NetworkInfo([
        0x2001, 0x0db8, 0x1234, 0x5678, 0xabcd, 0xef01, 0x2345, 0x6789, 64,
      ]);
      expect(result.baseIP).toEqual([
        0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 0,
      ]);
    });
  });
});
