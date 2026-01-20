import { describe, expect, it } from "vitest";
import { parseIPv6String } from "./parse";

describe("parseIPv6String - RFC 4291", () => {
  describe("Full notation (no compression)", () => {
    it("should parse full IPv6 address", () => {
      expect(
        parseIPv6String("2001:0db8:0000:0000:0008:0800:200c:417a/64"),
      ).toEqual([0x2001, 0x0db8, 0, 0, 8, 0x0800, 0x200c, 0x417a, 64]);
    });

    it("should parse with leading zeros", () => {
      expect(
        parseIPv6String("2001:0db8:0001:0002:0003:0004:0005:0006/128"),
      ).toEqual([0x2001, 0x0db8, 1, 2, 3, 4, 5, 6, 128]);
    });

    it("should parse all zeros", () => {
      expect(
        parseIPv6String("0000:0000:0000:0000:0000:0000:0000:0000/0"),
      ).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should parse all maximum values", () => {
      expect(
        parseIPv6String("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff/128"),
      ).toEqual([
        0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 128,
      ]);
    });
  });

  describe("Compressed notation (::)", () => {
    it("should parse :: as all zeros (RFC 4291 example)", () => {
      expect(parseIPv6String("::/128")).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 128]);
    });

    it("should parse ::1 as loopback (RFC 4291)", () => {
      expect(parseIPv6String("::1/128")).toEqual([0, 0, 0, 0, 0, 0, 0, 1, 128]);
    });

    it("should parse compression at start", () => {
      expect(parseIPv6String("::8:800:200c:417a/64")).toEqual([
        0, 0, 0, 0, 8, 0x800, 0x200c, 0x417a, 64,
      ]);
    });

    it("should parse compression in middle", () => {
      expect(parseIPv6String("2001:db8::8:800:200c:417a/64")).toEqual([
        0x2001, 0x0db8, 0, 0, 8, 0x800, 0x200c, 0x417a, 64,
      ]);
    });

    it("should parse compression at end", () => {
      expect(parseIPv6String("2001:db8::/32")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 32,
      ]);
    });

    it("should parse RFC 3849 documentation prefix", () => {
      expect(parseIPv6String("2001:db8::/32")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 32,
      ]);
    });

    it("should compress longest consecutive zero sequence", () => {
      expect(parseIPv6String("ff01::101/128")).toEqual([
        0xff01, 0, 0, 0, 0, 0, 0, 0x101, 128,
      ]);
    });
  });

  describe("RFC 4193 - Unique Local Addresses (ULA)", () => {
    it("should parse fd00::/8 (local ULA)", () => {
      expect(parseIPv6String("fd00::/8")).toEqual([
        0xfd00, 0, 0, 0, 0, 0, 0, 0, 8,
      ]);
    });

    it("should parse fc00::/7 (full ULA range)", () => {
      expect(parseIPv6String("fc00::/7")).toEqual([
        0xfc00, 0, 0, 0, 0, 0, 0, 0, 7,
      ]);
    });

    it("should parse ULA with subnet", () => {
      expect(parseIPv6String("fd12:3456:789a:1::/64")).toEqual([
        0xfd12, 0x3456, 0x789a, 1, 0, 0, 0, 0, 64,
      ]);
    });
  });

  describe("RFC 4291 - Link-local addresses", () => {
    it("should parse fe80::/10 (link-local)", () => {
      expect(parseIPv6String("fe80::/10")).toEqual([
        0xfe80, 0, 0, 0, 0, 0, 0, 0, 10,
      ]);
    });

    it("should parse link-local with interface ID", () => {
      expect(parseIPv6String("fe80::1/64")).toEqual([
        0xfe80, 0, 0, 0, 0, 0, 0, 1, 64,
      ]);
    });
  });

  describe("RFC 4291 - Multicast addresses", () => {
    it("should parse ff00::/8 (multicast)", () => {
      expect(parseIPv6String("ff00::/8")).toEqual([
        0xff00, 0, 0, 0, 0, 0, 0, 0, 8,
      ]);
    });

    it("should parse all-nodes multicast", () => {
      expect(parseIPv6String("ff02::1/128")).toEqual([
        0xff02, 0, 0, 0, 0, 0, 0, 1, 128,
      ]);
    });
  });

  describe("RFC 6052 - NAT64", () => {
    it("should parse 64:ff9b::/96 (well-known NAT64 prefix)", () => {
      expect(parseIPv6String("64:ff9b::/96")).toEqual([
        0x64, 0xff9b, 0, 0, 0, 0, 0, 0, 96,
      ]);
    });

    it("should parse NAT64 with embedded IPv4", () => {
      expect(parseIPv6String("64:ff9b::c0a8:1/128")).toEqual([
        0x64, 0xff9b, 0, 0, 0, 0, 0xc0a8, 1, 128,
      ]);
    });
  });

  describe("Prefix length boundaries", () => {
    it("should parse /0 prefix (entire IPv6 space)", () => {
      expect(parseIPv6String("::/0")).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("should parse /64 prefix (typical subnet)", () => {
      expect(parseIPv6String("2001:db8:1234:5678::/64")).toEqual([
        0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 0, 64,
      ]);
    });

    it("should parse /127 prefix (point-to-point)", () => {
      expect(parseIPv6String("2001:db8::1/127")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 127,
      ]);
    });

    it("should parse /128 prefix (single host)", () => {
      expect(parseIPv6String("2001:db8::1/128")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 128,
      ]);
    });
  });

  describe("Invalid inputs", () => {
    it("should reject prefix > 128", () => {
      expect(parseIPv6String("2001:db8::/129")).toBeNull();
    });

    it("should reject negative prefix", () => {
      expect(parseIPv6String("2001:db8::/-1")).toBeNull();
    });

    it("should reject more than 8 groups", () => {
      expect(parseIPv6String("1:2:3:4:5:6:7:8:9/64")).toBeNull();
    });

    it("should reject invalid hex characters", () => {
      expect(parseIPv6String("gggg::/64")).toBeNull();
      expect(parseIPv6String("2001:xyz::/32")).toBeNull();
    });

    it("should reject parts > 0xffff", () => {
      expect(parseIPv6String("10000::/64")).toBeNull();
      expect(parseIPv6String("2001:fffff::/32")).toBeNull();
    });

    it("should reject multiple :: compressions", () => {
      expect(parseIPv6String("2001::db8::1/64")).toBeNull();
    });

    it("should reject empty string", () => {
      expect(parseIPv6String("")).toBeNull();
    });

    it("should reject malformed CIDR", () => {
      expect(parseIPv6String("2001:db8::/")).toBeNull();
    });

    it("should reject non-numeric prefix", () => {
      expect(parseIPv6String("2001:db8::/abc")).toBeNull();
    });
  });

  describe("Edge cases", () => {
    it("should parse without prefix length (defaults to /128)", () => {
      const result = parseIPv6String("2001:db8::1");
      expect(result).not.toBeNull();
      expect(result![8]).toBe(128);
    });

    it("should handle lowercase and uppercase hex", () => {
      expect(parseIPv6String("2001:DB8::1/64")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 64,
      ]);
      expect(parseIPv6String("2001:db8::1/64")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 64,
      ]);
    });

    it("should parse RFC 6666 discard prefix", () => {
      expect(parseIPv6String("100::/64")).toEqual([
        0x100, 0, 0, 0, 0, 0, 0, 0, 64,
      ]);
    });

    it("should handle whitespace trimming", () => {
      expect(parseIPv6String("  2001:db8::1/64  ")).toEqual([
        0x2001, 0x0db8, 0, 0, 0, 0, 0, 1, 64,
      ]);
    });
  });
});
