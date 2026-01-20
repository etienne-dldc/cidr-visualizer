import { describe, expect, it } from "vitest";
import { getIPv4Mask } from "./mask";
import { generateRandomIPv4CIDR, generateRandomIPv4InNetwork } from "./random";

describe("IPv4 Random Generation - RFC 791", () => {
  describe("generateRandomIPv4CIDR", () => {
    it("should generate random CIDR with specified prefix", () => {
      const cidr = generateRandomIPv4CIDR(24);
      expect(cidr).toHaveLength(5);
      expect(cidr[4]).toBe(24);
    });

    it("should zero host bits according to prefix", () => {
      for (let i = 0; i < 10; i++) {
        const cidr = generateRandomIPv4CIDR(24);
        const mask = getIPv4Mask(24);

        // Network bits should match when masked
        for (let j = 0; j < 4; j++) {
          expect((cidr[j] & mask[j]) === cidr[j]).toBe(true);
        }
      }
    });

    it("should generate different IPs on multiple calls", () => {
      const cidrs = new Set();
      for (let i = 0; i < 100; i++) {
        const cidr = generateRandomIPv4CIDR(16);
        cidrs.add(`${cidr[0]}.${cidr[1]}.${cidr[2]}.${cidr[3]}`);
      }
      // With 100 iterations and /16 prefix, should have multiple unique IPs
      expect(cidrs.size).toBeGreaterThan(1);
    });

    it("should handle /0 prefix (entire space)", () => {
      const cidr = generateRandomIPv4CIDR(0);
      expect(cidr[4]).toBe(0);
      // All bits should be zero for network
      expect(cidr.slice(0, 4)).toEqual([0, 0, 0, 0]);
    });

    it("should handle /32 prefix (single host)", () => {
      const cidr = generateRandomIPv4CIDR(32);
      expect(cidr[4]).toBe(32);
      // All octets should be valid (0-255)
      cidr.slice(0, 4).forEach((octet) => {
        expect(octet).toBeGreaterThanOrEqual(0);
        expect(octet).toBeLessThanOrEqual(255);
      });
    });

    it("should handle /8 prefix correctly", () => {
      for (let i = 0; i < 10; i++) {
        const cidr = generateRandomIPv4CIDR(8);
        // Last 3 octets should be zero (host bits)
        expect(cidr[1]).toBe(0);
        expect(cidr[2]).toBe(0);
        expect(cidr[3]).toBe(0);
        // First octet can be anything
        expect(cidr[0]).toBeGreaterThanOrEqual(0);
        expect(cidr[0]).toBeLessThanOrEqual(255);
      }
    });

    it("should handle /16 prefix correctly", () => {
      for (let i = 0; i < 10; i++) {
        const cidr = generateRandomIPv4CIDR(16);
        // Last 2 octets should be zero
        expect(cidr[2]).toBe(0);
        expect(cidr[3]).toBe(0);
      }
    });

    it("should handle /31 prefix (point-to-point)", () => {
      const cidr = generateRandomIPv4CIDR(31);
      expect(cidr[4]).toBe(31);
      // Last bit should be zero
      expect(cidr[3] & 1).toBe(0);
    });
  });

  describe("generateRandomIPv4InNetwork", () => {
    it("should generate IP within specified network", () => {
      const network: [number, number, number, number, number] = [
        192, 168, 1, 0, 24,
      ];
      for (let i = 0; i < 10; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        expect(ip[0]).toBe(192);
        expect(ip[1]).toBe(168);
        expect(ip[2]).toBe(1);
        expect(ip[3]).toBeGreaterThanOrEqual(0);
        expect(ip[3]).toBeLessThanOrEqual(255);
      }
    });

    it("should preserve network bits", () => {
      const network: [number, number, number, number, number] = [
        10, 0, 0, 0, 8,
      ];

      for (let i = 0; i < 10; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        expect(ip[0]).toBe(10);
      }
    });

    it("should generate different host IPs in network", () => {
      const network: [number, number, number, number, number] = [
        192, 168, 1, 0, 24,
      ];
      const ips = new Set();

      for (let i = 0; i < 50; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        ips.add(ip[3]);
      }

      // Should generate multiple different host IPs
      expect(ips.size).toBeGreaterThan(1);
    });

    it("should handle /32 network (single host)", () => {
      const network: [number, number, number, number, number] = [
        192, 168, 1, 1, 32,
      ];
      for (let i = 0; i < 5; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        // Returns CIDR with prefix
        expect(ip).toEqual([192, 168, 1, 1, 32]);
      }
    });

    it("should handle /31 network (point-to-point)", () => {
      const network: [number, number, number, number, number] = [
        192, 168, 1, 0, 31,
      ];
      const ips = new Set();

      for (let i = 0; i < 10; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        ips.add(ip[3]);
      }

      // Should only generate 0 or 1 as last octet
      expect(ips.size).toBeLessThanOrEqual(2);
      ips.forEach((lastOctet) => {
        expect([0, 1]).toContain(lastOctet);
      });
    });

    it("should handle /16 network", () => {
      const network: [number, number, number, number, number] = [
        172, 16, 0, 0, 16,
      ];
      const uniqueThirdOctets = new Set();

      for (let i = 0; i < 50; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        expect(ip[0]).toBe(172);
        expect(ip[1]).toBe(16);
        uniqueThirdOctets.add(ip[2]);
      }

      // Should generate variety in host bits
      expect(uniqueThirdOctets.size).toBeGreaterThan(1);
    });

    it("should respect network address with host bits set", () => {
      // Even if input has host bits set, output should be within correct network
      const network: [number, number, number, number, number] = [
        192, 168, 1, 123, 24,
      ];
      for (let i = 0; i < 10; i++) {
        const ip = generateRandomIPv4InNetwork(network);
        expect(ip[0]).toBe(192);
        expect(ip[1]).toBe(168);
        expect(ip[2]).toBe(1);
      }
    });
  });

  describe("Generated IPs validity", () => {
    it("should generate valid octets (0-255)", () => {
      for (let prefix = 0; prefix <= 32; prefix++) {
        const cidr = generateRandomIPv4CIDR(prefix);
        cidr.slice(0, 4).forEach((octet) => {
          expect(octet).toBeGreaterThanOrEqual(0);
          expect(octet).toBeLessThanOrEqual(255);
        });
      }
    });
  });
});
