import { describe, expect, it } from "vitest";
import { checkIPv4Reserved } from "./reserved";

describe("checkIPv4Reserved - RFC 1918, 5737, 6598, 6890", () => {
  describe("RFC 1918 - Private address blocks", () => {
    it("should detect 10.0.0.0/8 as private network", () => {
      const result = checkIPv4Reserved([10, 0, 0, 0, 8]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Private network");
    });

    it("should detect any IP in 10.0.0.0/8 range as private", () => {
      expect(checkIPv4Reserved([10, 50, 100, 200, 24])?.name).toBe(
        "Private network",
      );
      expect(checkIPv4Reserved([10, 255, 255, 255, 32])?.name).toBe(
        "Private network",
      );
    });

    it("should detect 172.16.0.0/12 as private network", () => {
      const result = checkIPv4Reserved([172, 16, 0, 0, 12]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Private network");
    });

    it("should detect IPs within 172.16.0.0/12 range as private", () => {
      expect(checkIPv4Reserved([172, 16, 0, 1, 32])?.name).toBe(
        "Private network",
      );
      expect(checkIPv4Reserved([172, 20, 0, 0, 24])?.name).toBe(
        "Private network",
      );
      expect(checkIPv4Reserved([172, 31, 255, 255, 32])?.name).toBe(
        "Private network",
      );
    });

    it("should NOT detect IPs outside 172.16.0.0/12 as private", () => {
      expect(checkIPv4Reserved([172, 15, 0, 0, 24])?.name).not.toBe(
        "Private network",
      );
      expect(checkIPv4Reserved([172, 32, 0, 0, 24])?.name).not.toBe(
        "Private network",
      );
    });

    it("should detect 192.168.0.0/16 as private network", () => {
      const result = checkIPv4Reserved([192, 168, 0, 0, 16]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Private network");
    });

    it("should detect any IP in 192.168.0.0/16 range as private", () => {
      expect(checkIPv4Reserved([192, 168, 1, 1, 24])?.name).toBe(
        "Private network",
      );
      expect(checkIPv4Reserved([192, 168, 255, 255, 32])?.name).toBe(
        "Private network",
      );
    });
  });

  describe("RFC 5737 - Documentation addresses", () => {
    it("should detect 192.0.2.0/24 as TEST-NET-1", () => {
      const result = checkIPv4Reserved([192, 0, 2, 0, 24]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("TEST-NET-1");
    });

    it("should detect IPs in TEST-NET-1 range", () => {
      expect(checkIPv4Reserved([192, 0, 2, 100, 32])?.name).toBe("TEST-NET-1");
      expect(checkIPv4Reserved([192, 0, 2, 255, 32])?.name).toBe("TEST-NET-1");
    });

    it("should detect 198.51.100.0/24 as TEST-NET-2", () => {
      const result = checkIPv4Reserved([198, 51, 100, 0, 24]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("TEST-NET-2");
    });

    it("should detect 203.0.113.0/24 as TEST-NET-3", () => {
      const result = checkIPv4Reserved([203, 0, 113, 0, 24]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("TEST-NET-3");
    });
  });

  describe("RFC 6598 - Shared address space (CGN)", () => {
    it("should detect 100.64.0.0/10 as shared address space", () => {
      const result = checkIPv4Reserved([100, 64, 0, 0, 10]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Shared address space");
    });

    it("should detect IPs within 100.64.0.0/10 range", () => {
      expect(checkIPv4Reserved([100, 64, 0, 1, 32])?.name).toBe(
        "Shared address space",
      );
      expect(checkIPv4Reserved([100, 100, 0, 0, 24])?.name).toBe(
        "Shared address space",
      );
      expect(checkIPv4Reserved([100, 127, 255, 255, 32])?.name).toBe(
        "Shared address space",
      );
    });

    it("should NOT detect IPs outside 100.64.0.0/10", () => {
      expect(checkIPv4Reserved([100, 63, 255, 255, 32])?.name).not.toBe(
        "Shared address space",
      );
      expect(checkIPv4Reserved([100, 128, 0, 0, 24])?.name).not.toBe(
        "Shared address space",
      );
    });
  });

  describe("RFC 1122 - Special addresses", () => {
    it("should detect 127.0.0.0/8 as loopback", () => {
      const result = checkIPv4Reserved([127, 0, 0, 0, 8]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Loopback");
    });

    it("should detect any IP in 127.0.0.0/8 as loopback", () => {
      expect(checkIPv4Reserved([127, 0, 0, 1, 32])?.name).toBe("Loopback");
      expect(checkIPv4Reserved([127, 50, 100, 200, 24])?.name).toBe("Loopback");
    });

    it("should detect 0.0.0.0/8 as 'this network'", () => {
      const result = checkIPv4Reserved([0, 0, 0, 0, 8]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("This network");
    });
  });

  describe("RFC 3927 - Link-local addresses", () => {
    it("should detect 169.254.0.0/16 as link-local", () => {
      const result = checkIPv4Reserved([169, 254, 0, 0, 16]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Link-local");
    });

    it("should detect IPs in link-local range (APIPA)", () => {
      expect(checkIPv4Reserved([169, 254, 1, 1, 32])?.name).toBe("Link-local");
      expect(checkIPv4Reserved([169, 254, 255, 255, 32])?.name).toBe(
        "Link-local",
      );
    });
  });

  describe("RFC 5771 - Multicast addresses", () => {
    it("should detect 224.0.0.0/4 as multicast", () => {
      const result = checkIPv4Reserved([224, 0, 0, 0, 4]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Multicast");
    });

    it("should detect IPs in multicast range (224-239)", () => {
      expect(checkIPv4Reserved([224, 0, 0, 1, 32])?.name).toBe("Multicast");
      expect(checkIPv4Reserved([230, 0, 0, 0, 24])?.name).toBe("Multicast");
      expect(checkIPv4Reserved([239, 255, 255, 255, 32])?.name).toBe(
        "Multicast",
      );
    });
  });

  describe("RFC 6890 - Reserved for future use", () => {
    it("should detect 240.0.0.0/4 as reserved", () => {
      const result = checkIPv4Reserved([240, 0, 0, 0, 4]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Reserved");
    });

    it("should detect IPs in reserved range (240-255)", () => {
      expect(checkIPv4Reserved([240, 0, 0, 1, 32])?.name).toBe("Reserved");
      expect(checkIPv4Reserved([250, 0, 0, 0, 24])?.name).toBe("Reserved");
    });
  });

  describe("RFC 919 - Limited broadcast", () => {
    it("should detect 255.255.255.255/32 as broadcast", () => {
      const result = checkIPv4Reserved([255, 255, 255, 255, 32]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Broadcast");
    });
  });

  describe("RFC 6890 - IETF Protocol Assignments", () => {
    it("should detect 192.0.0.0/24 as IETF Protocol Assignments", () => {
      const result = checkIPv4Reserved([192, 0, 0, 0, 24]);
      expect(result).not.toBeNull();
      expect(result?.name).toBe("IETF Protocol Assignments");
    });
  });

  describe("Non-reserved addresses", () => {
    it("should return null for public IP addresses", () => {
      expect(checkIPv4Reserved([8, 8, 8, 8, 32])).toBeNull();
      expect(checkIPv4Reserved([1, 1, 1, 1, 32])).toBeNull();
      expect(checkIPv4Reserved([151, 101, 1, 1, 24])).toBeNull();
    });
  });

  describe("Longest prefix match", () => {
    it("should return most specific matching range", () => {
      // 10.0.0.0 matches both 0.0.0.0/8 and 10.0.0.0/8
      // Should return 10.0.0.0/8 as it's more specific
      const result = checkIPv4Reserved([10, 0, 0, 0, 8]);
      expect(result?.name).toBe("Private network");
    });
  });
});
