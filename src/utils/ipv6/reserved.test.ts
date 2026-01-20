import { describe, expect, it } from "vitest";
import { checkIPv6Reserved } from "./reserved";

describe("checkIPv6Reserved - RFC 3849, 4193, 4291, 6052, 6666", () => {
  describe("RFC 4291 - Special addresses", () => {
    it("should detect ::/128 as unspecified", () => {
      const result = checkIPv6Reserved([0, 0, 0, 0, 0, 0, 0, 0, 128]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Unspecified address");
    });

    it("should detect ::1/128 as loopback", () => {
      const result = checkIPv6Reserved([0, 0, 0, 0, 0, 0, 0, 1, 128]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Loopback");
    });

    it("should detect fe80::/10 as link-local", () => {
      const result = checkIPv6Reserved([0xfe80, 0, 0, 0, 0, 0, 0, 0, 10]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Link-local unicast");
    });

    it("should detect IPs in link-local range", () => {
      expect(checkIPv6Reserved([0xfe80, 0, 0, 0, 0, 0, 0, 1, 64])?.name).toBe(
        "Link-local unicast",
      );
    });

    it("should detect ff00::/8 as multicast", () => {
      const result = checkIPv6Reserved([0xff00, 0, 0, 0, 0, 0, 0, 0, 8]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Multicast");
    });

    it("should detect multicast range", () => {
      expect(checkIPv6Reserved([0xff02, 0, 0, 0, 0, 0, 0, 1, 128])?.name).toBe(
        "Multicast",
      );
    });
  });

  describe("RFC 3849 - Documentation prefix", () => {
    it("should detect 2001:db8::/32 as documentation", () => {
      const result = checkIPv6Reserved([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 32]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Documentation");
    });

    it("should detect IPs within documentation range", () => {
      expect(
        checkIPv6Reserved([0x2001, 0x0db8, 0x1234, 0x5678, 0, 0, 0, 1, 64])
          ?.name,
      ).toBe("Documentation");
    });
  });

  describe("RFC 4193 - Unique Local Addresses", () => {
    it("should detect fc00::/7 as unique local", () => {
      const result = checkIPv6Reserved([0xfc00, 0, 0, 0, 0, 0, 0, 0, 7]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Unique local address");
    });

    it("should detect fd00::/8 as unique local", () => {
      const result = checkIPv6Reserved([0xfd00, 0, 0, 0, 0, 0, 0, 0, 8]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Unique local address");
    });

    it("should detect IPs in ULA range", () => {
      expect(
        checkIPv6Reserved([0xfd12, 0x3456, 0x789a, 1, 0, 0, 0, 0, 64])?.name,
      ).toBe("Unique local address");
    });
  });

  describe("RFC 6052 - NAT64", () => {
    it("should detect 64:ff9b::/96 as NAT64", () => {
      const result = checkIPv6Reserved([0x64, 0xff9b, 0, 0, 0, 0, 0, 0, 96]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("IPv4/IPv6 translation");
    });

    it("should detect IPs in NAT64 range", () => {
      expect(
        checkIPv6Reserved([0x64, 0xff9b, 0, 0, 0, 0, 0xc0a8, 1, 128])?.name,
      ).toBe("IPv4/IPv6 translation");
    });
  });

  describe("RFC 6666 - Discard prefix", () => {
    it("should detect 100::/64 as discard prefix", () => {
      const result = checkIPv6Reserved([0x100, 0, 0, 0, 0, 0, 0, 0, 64]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Discard prefix");
    });
  });

  describe("Non-reserved addresses", () => {
    it("should return null for public IP addresses", () => {
      expect(
        checkIPv6Reserved([0x2606, 0x4700, 0, 0, 0, 0, 0, 1, 128]),
      ).toBeNull();
      expect(
        checkIPv6Reserved([0x2400, 0xcb00, 0, 0, 0, 0, 0, 1, 128]),
      ).toBeNull();
    });
  });
});
