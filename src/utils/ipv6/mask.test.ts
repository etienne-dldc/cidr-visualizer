import { describe, expect, it } from "vitest";
import { getIPv6Mask } from "./mask";

describe("getIPv6Mask - RFC 4291", () => {
  describe("Prefix length boundaries", () => {
    it("should generate mask for /0 (all zeros)", () => {
      expect(getIPv6Mask(0)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for /16 (first part)", () => {
      expect(getIPv6Mask(16)).toEqual([0xffff, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for /64 (typical subnet)", () => {
      expect(getIPv6Mask(64)).toEqual([
        0xffff, 0xffff, 0xffff, 0xffff, 0, 0, 0, 0,
      ]);
    });

    it("should generate mask for /128 (all ones, single host)", () => {
      expect(getIPv6Mask(128)).toEqual([
        0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff,
      ]);
    });
  });

  describe("Bitwise operations for non-16-bit boundaries", () => {
    it("should generate mask for /1", () => {
      expect(getIPv6Mask(1)).toEqual([0x8000, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for /15", () => {
      expect(getIPv6Mask(15)).toEqual([0xfffe, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for /17", () => {
      expect(getIPv6Mask(17)).toEqual([0xffff, 0x8000, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for /127 (point-to-point)", () => {
      expect(getIPv6Mask(127)).toEqual([
        0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xfffe,
      ]);
    });
  });

  describe("RFC-specific examples", () => {
    it("should generate mask for RFC 3849 documentation prefix (/32)", () => {
      expect(getIPv6Mask(32)).toEqual([0xffff, 0xffff, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for RFC 4193 ULA (/7)", () => {
      expect(getIPv6Mask(7)).toEqual([0xfe00, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should generate mask for RFC 6052 NAT64 (/96)", () => {
      expect(getIPv6Mask(96)).toEqual([
        0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0, 0,
      ]);
    });

    it("should generate mask for RFC 4291 link-local (/10)", () => {
      expect(getIPv6Mask(10)).toEqual([0xffc0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });
});
