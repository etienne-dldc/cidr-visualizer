import { describe, expect, it } from "vitest";
import { detectIPType } from "./detectIPType";

describe("detectIPType - RFC 791, RFC 4291", () => {
  describe("IPv4 detection", () => {
    it("should detect valid IPv4 CIDR", () => {
      const result = detectIPType("192.168.1.0/24");
      expect(result.ipv4).toEqual([192, 168, 1, 0, 24]);
      expect(result.ipv6).toBeNull();
    });

    it("should detect IPv4 private networks", () => {
      expect(detectIPType("10.0.0.0/8").ipv4).not.toBeNull();
      expect(detectIPType("172.16.0.0/12").ipv4).not.toBeNull();
      expect(detectIPType("192.168.0.0/16").ipv4).not.toBeNull();
    });
  });

  describe("IPv6 detection", () => {
    it("should detect valid IPv6 CIDR", () => {
      const result = detectIPType("2001:db8::/32");
      expect(result.ipv6).toEqual([0x2001, 0x0db8, 0, 0, 0, 0, 0, 0, 32]);
      expect(result.ipv4).toBeNull();
    });

    it("should detect IPv6 compressed notation", () => {
      const result = detectIPType("::1/128");
      expect(result.ipv6).toEqual([0, 0, 0, 0, 0, 0, 0, 1, 128]);
      expect(result.ipv4).toBeNull();
    });

    it("should detect IPv6 ULA", () => {
      expect(detectIPType("fd00::/8").ipv6).not.toBeNull();
    });

    it("should detect IPv6 link-local", () => {
      expect(detectIPType("fe80::/10").ipv6).not.toBeNull();
    });
  });

  describe("Both fail detection", () => {
    it("should return null for both when input is invalid", () => {
      const result = detectIPType("invalid");
      expect(result.ipv4).toBeNull();
      expect(result.ipv6).toBeNull();
    });

    it("should return null for empty string", () => {
      const result = detectIPType("");
      expect(result.ipv4).toBeNull();
      expect(result.ipv6).toBeNull();
    });

    it("should return null for malformed CIDR", () => {
      const result = detectIPType("192.168.1/24");
      expect(result.ipv4).toBeNull();
      expect(result.ipv6).toBeNull();
    });
  });

  describe("Precedence and ambiguity", () => {
    it("should try both parsers independently", () => {
      // IPv4 should parse correctly
      const ipv4Result = detectIPType("192.168.1.0/24");
      expect(ipv4Result.ipv4).not.toBeNull();
      expect(ipv4Result.ipv6).toBeNull();

      // IPv6 should parse correctly
      const ipv6Result = detectIPType("2001:db8::/32");
      expect(ipv6Result.ipv6).not.toBeNull();
      expect(ipv6Result.ipv4).toBeNull();
    });

    it("should handle whitespace", () => {
      const result = detectIPType("  192.168.1.0/24  ");
      expect(result.ipv4).not.toBeNull();
    });
  });
});
