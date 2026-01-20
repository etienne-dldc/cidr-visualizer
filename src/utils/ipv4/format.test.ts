import { describe, expect, it } from "vitest";
import { formatCount, formatIPv4 } from "./format";
import type { IPv4CIDR } from "./types";

describe("IPv4 Formatting - RFC 791", () => {
  describe("formatIPv4", () => {
    it("should format standard IPv4 address", () => {
      expect(formatIPv4([192, 168, 1, 1])).toBe("192.168.1.1");
    });

    it("should format all zeros", () => {
      expect(formatIPv4([0, 0, 0, 0])).toBe("0.0.0.0");
    });

    it("should format all maximum values", () => {
      expect(formatIPv4([255, 255, 255, 255])).toBe("255.255.255.255");
    });

    it("should format RFC 1918 private addresses", () => {
      expect(formatIPv4([10, 0, 0, 0])).toBe("10.0.0.0");
      expect(formatIPv4([172, 16, 0, 0])).toBe("172.16.0.0");
      expect(formatIPv4([192, 168, 0, 0])).toBe("192.168.0.0");
    });

    it("should format loopback address", () => {
      expect(formatIPv4([127, 0, 0, 1])).toBe("127.0.0.1");
    });

    it("should format link-local address", () => {
      expect(formatIPv4([169, 254, 1, 1])).toBe("169.254.1.1");
    });

    it("should format documentation addresses", () => {
      expect(formatIPv4([192, 0, 2, 1])).toBe("192.0.2.1");
      expect(formatIPv4([198, 51, 100, 1])).toBe("198.51.100.1");
      expect(formatIPv4([203, 0, 113, 1])).toBe("203.0.113.1");
    });
  });

  describe("formatIPv4CIDR", () => {
    it("should format IPv4 CIDR notation", () => {
      const cidr: IPv4CIDR = [192, 168, 1, 0, 24];
      expect(
        `${formatIPv4([cidr[0], cidr[1], cidr[2], cidr[3]])}/${cidr[4]}`,
      ).toBe("192.168.1.0/24");
    });

    it("should format /0 prefix", () => {
      const cidr: IPv4CIDR = [0, 0, 0, 0, 0];
      expect(
        `${formatIPv4([cidr[0], cidr[1], cidr[2], cidr[3]])}/${cidr[4]}`,
      ).toBe("0.0.0.0/0");
    });

    it("should format /32 prefix", () => {
      const cidr: IPv4CIDR = [192, 168, 1, 1, 32];
      expect(
        `${formatIPv4([cidr[0], cidr[1], cidr[2], cidr[3]])}/${cidr[4]}`,
      ).toBe("192.168.1.1/32");
    });

    it("should format /31 prefix (point-to-point)", () => {
      const cidr: IPv4CIDR = [192, 168, 1, 0, 31];
      expect(
        `${formatIPv4([cidr[0], cidr[1], cidr[2], cidr[3]])}/${cidr[4]}`,
      ).toBe("192.168.1.0/31");
    });

    it("should format RFC 1918 private networks", () => {
      const cidr1: IPv4CIDR = [10, 0, 0, 0, 8];
      expect(
        `${formatIPv4([cidr1[0], cidr1[1], cidr1[2], cidr1[3]])}/${cidr1[4]}`,
      ).toBe("10.0.0.0/8");
      const cidr2: IPv4CIDR = [172, 16, 0, 0, 12];
      expect(
        `${formatIPv4([cidr2[0], cidr2[1], cidr2[2], cidr2[3]])}/${cidr2[4]}`,
      ).toBe("172.16.0.0/12");
      const cidr3: IPv4CIDR = [192, 168, 0, 0, 16];
      expect(
        `${formatIPv4([cidr3[0], cidr3[1], cidr3[2], cidr3[3]])}/${cidr3[4]}`,
      ).toBe("192.168.0.0/16");
    });

    it("should format CGN shared address space", () => {
      const cidr: IPv4CIDR = [100, 64, 0, 0, 10];
      expect(
        `${formatIPv4([cidr[0], cidr[1], cidr[2], cidr[3]])}/${cidr[4]}`,
      ).toBe("100.64.0.0/10");
    });
  });

  describe("formatCount", () => {
    it("should format small host counts with commas", () => {
      expect(formatCount(254n)).toBe("254");
      expect(formatCount(1000n)).toBe("1,000");
      expect(formatCount(65534n)).toBe("65,534");
    });

    it("should format large host counts", () => {
      expect(formatCount(16777214n)).toBe("16,777,214");
      expect(formatCount(4294967294n)).toBe("4,294,967,294");
    });

    it("should format zero count", () => {
      expect(formatCount(0n)).toBe("0");
    });

    it("should handle very large IPv6-sized numbers", () => {
      const largeNumber = BigInt("18446744073709551614"); // 2^64 - 2
      const formatted = formatCount(largeNumber);
      expect(formatted).toContain(",");
      expect(formatted.replace(/,/g, "")).toBe("18446744073709551614");
    });
  });
});
