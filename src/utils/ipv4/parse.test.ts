import { describe, expect, it } from "vitest";
import { parseIPv4String } from "./parse";

describe("parseIPv4String - RFC 791, RFC 1122", () => {
  describe("Valid CIDR notation", () => {
    it("should parse standard IPv4 CIDR", () => {
      expect(parseIPv4String("192.168.1.0/24")).toEqual([192, 168, 1, 0, 24]);
    });

    it("should parse RFC 1918 private address blocks", () => {
      expect(parseIPv4String("10.0.0.0/8")).toEqual([10, 0, 0, 0, 8]);
      expect(parseIPv4String("172.16.0.0/12")).toEqual([172, 16, 0, 0, 12]);
      expect(parseIPv4String("192.168.0.0/16")).toEqual([192, 168, 0, 0, 16]);
    });

    it("should parse RFC 5737 documentation addresses", () => {
      expect(parseIPv4String("192.0.2.0/24")).toEqual([192, 0, 2, 0, 24]);
      expect(parseIPv4String("198.51.100.0/24")).toEqual([198, 51, 100, 0, 24]);
      expect(parseIPv4String("203.0.113.0/24")).toEqual([203, 0, 113, 0, 24]);
    });

    it("should parse RFC 6598 shared address space (CGN)", () => {
      expect(parseIPv4String("100.64.0.0/10")).toEqual([100, 64, 0, 0, 10]);
    });

    it("should parse loopback address (RFC 1122)", () => {
      expect(parseIPv4String("127.0.0.1/8")).toEqual([127, 0, 0, 1, 8]);
    });

    it("should parse all octets at maximum value", () => {
      expect(parseIPv4String("255.255.255.255/32")).toEqual([
        255, 255, 255, 255, 32,
      ]);
    });

    it("should parse all octets at minimum value", () => {
      expect(parseIPv4String("0.0.0.0/0")).toEqual([0, 0, 0, 0, 0]);
    });
  });

  describe("Prefix length boundaries (RFC 791)", () => {
    it("should parse /0 prefix (entire IPv4 space)", () => {
      expect(parseIPv4String("0.0.0.0/0")).toEqual([0, 0, 0, 0, 0]);
    });

    it("should parse /8 prefix (Class A)", () => {
      expect(parseIPv4String("10.0.0.0/8")).toEqual([10, 0, 0, 0, 8]);
    });

    it("should parse /16 prefix (Class B)", () => {
      expect(parseIPv4String("172.16.0.0/16")).toEqual([172, 16, 0, 0, 16]);
    });

    it("should parse /24 prefix (Class C)", () => {
      expect(parseIPv4String("192.168.1.0/24")).toEqual([192, 168, 1, 0, 24]);
    });

    it("should parse /31 prefix (point-to-point link, RFC 3021)", () => {
      expect(parseIPv4String("192.168.1.0/31")).toEqual([192, 168, 1, 0, 31]);
    });

    it("should parse /32 prefix (single host)", () => {
      expect(parseIPv4String("192.168.1.1/32")).toEqual([192, 168, 1, 1, 32]);
    });
  });

  describe("Invalid inputs", () => {
    it("should reject octets > 255", () => {
      expect(parseIPv4String("256.0.0.0/24")).toBeNull();
      expect(parseIPv4String("192.256.1.0/24")).toBeNull();
      expect(parseIPv4String("192.168.256.0/24")).toBeNull();
      expect(parseIPv4String("192.168.1.256/24")).toBeNull();
    });

    it("should reject prefix length > 32", () => {
      expect(parseIPv4String("192.168.1.0/33")).toBeNull();
      expect(parseIPv4String("192.168.1.0/64")).toBeNull();
    });

    it("should reject negative prefix length", () => {
      expect(parseIPv4String("192.168.1.0/-1")).toBeNull();
    });

    it("should reject non-numeric octets", () => {
      expect(parseIPv4String("192.168.1.x/24")).toBeNull();
      expect(parseIPv4String("abc.def.ghi.jkl/24")).toBeNull();
    });

    it("should reject malformed CIDR notation", () => {
      expect(parseIPv4String("192.168.1/24")).toBeNull();
      expect(parseIPv4String("192.168.1.0.1/24")).toBeNull();
      expect(parseIPv4String("192.168.1.0/")).toBeNull();
      // Note: No prefix defaults to /32, not rejection
      expect(parseIPv4String("192.168.1.0")).toEqual([192, 168, 1, 0, 32]);
    });

    it("should reject empty string", () => {
      expect(parseIPv4String("")).toBeNull();
    });

    it("should reject non-numeric prefix", () => {
      expect(parseIPv4String("192.168.1.0/abc")).toBeNull();
    });
  });

  describe("Edge cases", () => {
    it("should parse broadcast address", () => {
      expect(parseIPv4String("255.255.255.255/32")).toEqual([
        255, 255, 255, 255, 32,
      ]);
    });

    it("should parse RFC 1122 'this network' address", () => {
      expect(parseIPv4String("0.0.0.0/8")).toEqual([0, 0, 0, 0, 8]);
    });

    it("should parse link-local addresses (RFC 3927)", () => {
      expect(parseIPv4String("169.254.0.0/16")).toEqual([169, 254, 0, 0, 16]);
    });

    it("should parse multicast range (RFC 5771)", () => {
      expect(parseIPv4String("224.0.0.0/4")).toEqual([224, 0, 0, 0, 4]);
    });

    it("should parse reserved for future use (RFC 6890)", () => {
      expect(parseIPv4String("240.0.0.0/4")).toEqual([240, 0, 0, 0, 4]);
    });
  });
});
