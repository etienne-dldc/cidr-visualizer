import { describe, expect, it } from "vitest";
import { getIPv6Mask } from "./mask";
import { generateRandomIPv6CIDR, generateRandomIPv6InNetwork } from "./random";

describe("IPv6 Random Generation - RFC 4291", () => {
  describe("generateRandomIPv6CIDR", () => {
    it("should generate random CIDR with specified prefix", () => {
      const cidr = generateRandomIPv6CIDR(64);
      expect(cidr).toHaveLength(9);
      expect(cidr[8]).toBe(64);
    });

    it("should zero host bits according to prefix", () => {
      for (let i = 0; i < 10; i++) {
        const cidr = generateRandomIPv6CIDR(64);
        const mask = getIPv6Mask(64);

        // Network bits should match when masked
        for (let j = 0; j < 8; j++) {
          expect((cidr[j] & mask[j]) === cidr[j]).toBe(true);
        }
      }
    });

    it("should generate different IPs on multiple calls", () => {
      const cidrs = new Set();
      for (let i = 0; i < 50; i++) {
        const cidr = generateRandomIPv6CIDR(32);
        cidrs.add(`${cidr[0]}:${cidr[1]}`);
      }
      expect(cidrs.size).toBeGreaterThan(1);
    });

    it("should handle /0 prefix (entire space)", () => {
      const cidr = generateRandomIPv6CIDR(0);
      expect(cidr[8]).toBe(0);
      expect(cidr.slice(0, 8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should handle /128 prefix (single host)", () => {
      const cidr = generateRandomIPv6CIDR(128);
      expect(cidr[8]).toBe(128);
      cidr.slice(0, 8).forEach((part) => {
        expect(part).toBeGreaterThanOrEqual(0);
        expect(part).toBeLessThanOrEqual(0xffff);
      });
    });

    it("should handle /64 prefix correctly", () => {
      for (let i = 0; i < 10; i++) {
        const cidr = generateRandomIPv6CIDR(64);
        // Last 4 parts should be zero (host bits)
        expect(cidr[4]).toBe(0);
        expect(cidr[5]).toBe(0);
        expect(cidr[6]).toBe(0);
        expect(cidr[7]).toBe(0);
      }
    });
  });

  describe("generateRandomIPv6InNetwork", () => {
    it("should generate IP within specified network", () => {
      const network: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ] = [0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 0, 64];
      for (let i = 0; i < 10; i++) {
        const ip = generateRandomIPv6InNetwork(network);
        expect(ip[0]).toBe(0x2001);
        expect(ip[1]).toBe(0x0db8);
        expect(ip[2]).toBe(0x1234);
        expect(ip[3]).toBe(0x5678);
      }
    });

    it("should generate different host IPs in network", () => {
      const network: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ] = [0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 64];
      const ips = new Set();

      for (let i = 0; i < 50; i++) {
        const ip = generateRandomIPv6InNetwork(network);
        ips.add(`${ip[4]}:${ip[5]}:${ip[6]}:${ip[7]}`);
      }

      expect(ips.size).toBeGreaterThan(1);
    });

    it("should handle /128 network (single host)", () => {
      const network: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ] = [0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 128];
      for (let i = 0; i < 5; i++) {
        const ip = generateRandomIPv6InNetwork(network);
        // Returns CIDR with prefix
        expect(ip).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 128]);
      }
    });

    it("should respect network address with host bits set", () => {
      const network: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ] = [0x2001, 0x0db8, 0x1234, 0x5678, 0xabcd, 0xef01, 0x2345, 0x6789, 64];
      for (let i = 0; i < 10; i++) {
        const ip = generateRandomIPv6InNetwork(network);
        expect(ip[0]).toBe(0x2001);
        expect(ip[1]).toBe(0x0db8);
        expect(ip[2]).toBe(0x1234);
        expect(ip[3]).toBe(0x5678);
      }
    });
  });

  describe("Generated IPs validity", () => {
    it("should generate valid 16-bit parts (0-0xffff)", () => {
      for (let prefix = 0; prefix <= 128; prefix += 16) {
        const cidr = generateRandomIPv6CIDR(prefix);
        cidr.slice(0, 8).forEach((part) => {
          expect(part).toBeGreaterThanOrEqual(0);
          expect(part).toBeLessThanOrEqual(0xffff);
        });
      }
    });
  });
});
