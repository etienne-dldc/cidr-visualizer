import { describe, expect, it } from "vitest";
import { formatIPv6 } from "./format";

describe("formatIPv6 - RFC 4291", () => {
  describe("Compression rules", () => {
    it("should compress longest consecutive zero sequence", () => {
      expect(formatIPv6([0x2001, 0x0db8, 0, 0, 8, 0x800, 0x200c, 0x417a])).toBe(
        "2001:db8::8:800:200c:417a",
      );
    });

    it("should compress all zeros as ::", () => {
      expect(formatIPv6([0, 0, 0, 0, 0, 0, 0, 0])).toBe("::");
    });

    it("should format loopback as ::1", () => {
      expect(formatIPv6([0, 0, 0, 0, 0, 0, 0, 1])).toBe("::1");
    });

    it("should compress at end", () => {
      expect(formatIPv6([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0])).toBe("2001:db8::");
    });

    it("should compress at start", () => {
      expect(formatIPv6([0, 0, 0, 0, 0, 0, 0x200c, 0x417a])).toBe(
        "::200c:417a",
      );
    });

    it("should not compress single zero group", () => {
      expect(formatIPv6([0x2001, 0xdb8, 0, 1, 0, 0, 0, 1])).toBe(
        "2001:db8:0:1::1",
      );
    });
  });

  describe("RFC 3849 - Documentation prefix", () => {
    it("should format 2001:db8:: compressed", () => {
      expect(formatIPv6([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0])).toBe("2001:db8::");
    });
  });

  describe("RFC 4193 - ULA", () => {
    it("should format fd00:: compressed", () => {
      expect(formatIPv6([0xfd00, 0, 0, 0, 0, 0, 0, 0])).toBe("fd00::");
    });

    it("should format ULA with subnet", () => {
      expect(formatIPv6([0xfd12, 0x3456, 0x789a, 1, 0, 0, 0, 0])).toBe(
        "fd12:3456:789a:1::",
      );
    });
  });

  describe("RFC 4291 - Special addresses", () => {
    it("should format link-local", () => {
      expect(formatIPv6([0xfe80, 0, 0, 0, 0, 0, 0, 1])).toBe("fe80::1");
    });

    it("should format multicast", () => {
      expect(formatIPv6([0xff02, 0, 0, 0, 0, 0, 0, 1])).toBe("ff02::1");
    });
  });

  describe("Leading zeros removal", () => {
    it("should remove leading zeros from groups", () => {
      expect(formatIPv6([0x2001, 0x0db8, 1, 2, 3, 4, 5, 6])).toBe(
        "2001:db8:1:2:3:4:5:6",
      );
    });
  });

  describe("No compression needed", () => {
    it("should format full address without zeros", () => {
      expect(
        formatIPv6([
          0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff, 0xffff,
        ]),
      ).toBe("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });
  });
});
