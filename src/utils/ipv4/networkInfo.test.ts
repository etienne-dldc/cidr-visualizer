import { describe, expect, it } from "vitest";
import { calculateIPv4NetworkInfo } from "./networkInfo";

describe("calculateIPv4NetworkInfo - RFC 791, RFC 1122", () => {
  describe("Standard subnet calculations", () => {
    it("should calculate network info for /24 subnet", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 0, 24]);
      expect(result.mode).toBe("IPv4");
      expect(result.baseIP).toEqual([192, 168, 1, 0]);
      expect(result.broadcastIP).toEqual([192, 168, 1, 255]);
      expect(result.firstUsableIP).toEqual([192, 168, 1, 1]);
      expect(result.lastUsableIP).toEqual([192, 168, 1, 254]);
      expect(result.count).toBe(256n);
    });

    it("should calculate network info for /16 subnet (Class B)", () => {
      const result = calculateIPv4NetworkInfo([172, 16, 0, 0, 16]);
      expect(result.baseIP).toEqual([172, 16, 0, 0]);
      expect(result.broadcastIP).toEqual([172, 16, 255, 255]);
      expect(result.firstUsableIP).toEqual([172, 16, 0, 1]);
      expect(result.lastUsableIP).toEqual([172, 16, 255, 254]);
      expect(result.count).toBe(65536n);
    });

    it("should calculate network info for /8 subnet (Class A)", () => {
      const result = calculateIPv4NetworkInfo([10, 0, 0, 0, 8]);
      expect(result.baseIP).toEqual([10, 0, 0, 0]);
      expect(result.broadcastIP).toEqual([10, 255, 255, 255]);
      expect(result.firstUsableIP).toEqual([10, 0, 0, 1]);
      expect(result.lastUsableIP).toEqual([10, 255, 255, 254]);
      expect(result.count).toBe(16777216n);
    });
  });

  describe("RFC 1918 private networks", () => {
    it("should calculate network info for 10.0.0.0/8", () => {
      const result = calculateIPv4NetworkInfo([10, 0, 0, 0, 8]);
      expect(result.count).toBe(16777216n); // 2^24
    });

    it("should calculate network info for 172.16.0.0/12", () => {
      const result = calculateIPv4NetworkInfo([172, 16, 0, 0, 12]);
      expect(result.baseIP).toEqual([172, 16, 0, 0]);
      expect(result.broadcastIP).toEqual([172, 31, 255, 255]);
      expect(result.firstUsableIP).toEqual([172, 16, 0, 1]);
      expect(result.lastUsableIP).toEqual([172, 31, 255, 254]);
      expect(result.count).toBe(1048576n); // 2^20
    });

    it("should calculate network info for 192.168.0.0/16", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 0, 0, 16]);
      expect(result.count).toBe(65536n); // 2^16
    });
  });

  describe("Edge case: /32 (single host)", () => {
    it("should handle /32 prefix with no usable IPs", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 1, 32]);
      expect(result.baseIP).toEqual([192, 168, 1, 1]);
      expect(result.broadcastIP).toBeNull();
      expect(result.firstUsableIP).toBeNull();
      expect(result.lastUsableIP).toBeNull();
      expect(result.count).toBe(1n);
    });

    it("should handle broadcast address as /32", () => {
      const result = calculateIPv4NetworkInfo([255, 255, 255, 255, 32]);
      expect(result.baseIP).toEqual([255, 255, 255, 255]);
      expect(result.broadcastIP).toBeNull();
      expect(result.firstUsableIP).toBeNull();
      expect(result.lastUsableIP).toBeNull();
      expect(result.count).toBe(1n);
    });
  });

  describe("Edge case: /31 (point-to-point, RFC 3021)", () => {
    it("should handle /31 prefix with both addresses usable", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 0, 31]);
      expect(result.baseIP).toEqual([192, 168, 1, 0]);
      expect(result.broadcastIP).toBeNull();
      expect(result.firstUsableIP).toEqual([192, 168, 1, 0]);
      expect(result.lastUsableIP).toEqual([192, 168, 1, 1]);
      expect(result.count).toBe(2n);
    });
  });

  describe("Edge case: /0 (entire IPv4 space)", () => {
    it("should handle /0 prefix", () => {
      const result = calculateIPv4NetworkInfo([0, 0, 0, 0, 0]);
      expect(result.baseIP).toEqual([0, 0, 0, 0]);
      expect(result.broadcastIP).toEqual([255, 255, 255, 255]);
      expect(result.firstUsableIP).toEqual([0, 0, 0, 1]);
      expect(result.lastUsableIP).toEqual([255, 255, 255, 254]);
      expect(result.count).toBe(4294967296n); // 2^32
    });
  });

  describe("Small subnets", () => {
    it("should calculate network info for /30 (4 addresses)", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 0, 30]);
      expect(result.baseIP).toEqual([192, 168, 1, 0]);
      expect(result.broadcastIP).toEqual([192, 168, 1, 3]);
      expect(result.firstUsableIP).toEqual([192, 168, 1, 1]);
      expect(result.lastUsableIP).toEqual([192, 168, 1, 2]);
      expect(result.count).toBe(4n);
    });

    it("should calculate network info for /29 (8 addresses)", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 0, 29]);
      expect(result.baseIP).toEqual([192, 168, 1, 0]);
      expect(result.broadcastIP).toEqual([192, 168, 1, 7]);
      expect(result.firstUsableIP).toEqual([192, 168, 1, 1]);
      expect(result.lastUsableIP).toEqual([192, 168, 1, 6]);
      expect(result.count).toBe(8n);
    });

    it("should calculate network info for /28 (16 addresses)", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 0, 28]);
      expect(result.baseIP).toEqual([192, 168, 1, 0]);
      expect(result.broadcastIP).toEqual([192, 168, 1, 15]);
      expect(result.firstUsableIP).toEqual([192, 168, 1, 1]);
      expect(result.lastUsableIP).toEqual([192, 168, 1, 14]);
      expect(result.count).toBe(16n);
    });
  });

  describe("RFC 5737 documentation addresses", () => {
    it("should calculate network info for TEST-NET-1 (192.0.2.0/24)", () => {
      const result = calculateIPv4NetworkInfo([192, 0, 2, 0, 24]);
      expect(result.count).toBe(256n);
    });

    it("should calculate network info for TEST-NET-2 (198.51.100.0/24)", () => {
      const result = calculateIPv4NetworkInfo([198, 51, 100, 0, 24]);
      expect(result.count).toBe(256n);
    });
  });

  describe("RFC 6598 CGN shared address space", () => {
    it("should calculate network info for 100.64.0.0/10", () => {
      const result = calculateIPv4NetworkInfo([100, 64, 0, 0, 10]);
      expect(result.baseIP).toEqual([100, 64, 0, 0]);
      expect(result.broadcastIP).toEqual([100, 127, 255, 255]);
      expect(result.firstUsableIP).toEqual([100, 64, 0, 1]);
      expect(result.lastUsableIP).toEqual([100, 127, 255, 254]);
      expect(result.count).toBe(4194304n); // 2^22
    });
  });

  describe("Network address calculation with host bits set", () => {
    it("should zero host bits when calculating network address", () => {
      const result = calculateIPv4NetworkInfo([192, 168, 1, 123, 24]);
      expect(result.baseIP).toEqual([192, 168, 1, 0]);
    });

    it("should zero host bits for /16", () => {
      const result = calculateIPv4NetworkInfo([172, 16, 50, 100, 16]);
      expect(result.baseIP).toEqual([172, 16, 0, 0]);
    });
  });
});
