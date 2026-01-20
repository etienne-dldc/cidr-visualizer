import { describe, expect, it } from "vitest";
import { getIPv4Mask } from "./mask";

describe("getIPv4Mask - RFC 791", () => {
  describe("Prefix length boundaries", () => {
    it("should generate mask for /0 (all zeros)", () => {
      expect(getIPv4Mask(0)).toEqual([0, 0, 0, 0]);
    });

    it("should generate mask for /8 (Class A)", () => {
      expect(getIPv4Mask(8)).toEqual([255, 0, 0, 0]);
    });

    it("should generate mask for /16 (Class B)", () => {
      expect(getIPv4Mask(16)).toEqual([255, 255, 0, 0]);
    });

    it("should generate mask for /24 (Class C)", () => {
      expect(getIPv4Mask(24)).toEqual([255, 255, 255, 0]);
    });

    it("should generate mask for /32 (all ones, single host)", () => {
      expect(getIPv4Mask(32)).toEqual([255, 255, 255, 255]);
    });
  });

  describe("Bitwise operations for non-octet boundaries", () => {
    it("should generate mask for /1", () => {
      expect(getIPv4Mask(1)).toEqual([128, 0, 0, 0]);
    });

    it("should generate mask for /7", () => {
      expect(getIPv4Mask(7)).toEqual([254, 0, 0, 0]);
    });

    it("should generate mask for /9", () => {
      expect(getIPv4Mask(9)).toEqual([255, 128, 0, 0]);
    });

    it("should generate mask for /12 (RFC 1918 - 172.16.0.0/12)", () => {
      expect(getIPv4Mask(12)).toEqual([255, 240, 0, 0]);
    });

    it("should generate mask for /15", () => {
      expect(getIPv4Mask(15)).toEqual([255, 254, 0, 0]);
    });

    it("should generate mask for /17", () => {
      expect(getIPv4Mask(17)).toEqual([255, 255, 128, 0]);
    });

    it("should generate mask for /23", () => {
      expect(getIPv4Mask(23)).toEqual([255, 255, 254, 0]);
    });

    it("should generate mask for /25", () => {
      expect(getIPv4Mask(25)).toEqual([255, 255, 255, 128]);
    });

    it("should generate mask for /31 (point-to-point, RFC 3021)", () => {
      expect(getIPv4Mask(31)).toEqual([255, 255, 255, 254]);
    });
  });

  describe("All prefix lengths", () => {
    it("should generate correct masks for all prefix lengths 0-32", () => {
      const expectedMasks = [
        [0, 0, 0, 0], // /0
        [128, 0, 0, 0], // /1
        [192, 0, 0, 0], // /2
        [224, 0, 0, 0], // /3
        [240, 0, 0, 0], // /4
        [248, 0, 0, 0], // /5
        [252, 0, 0, 0], // /6
        [254, 0, 0, 0], // /7
        [255, 0, 0, 0], // /8
        [255, 128, 0, 0], // /9
        [255, 192, 0, 0], // /10
        [255, 224, 0, 0], // /11
        [255, 240, 0, 0], // /12
        [255, 248, 0, 0], // /13
        [255, 252, 0, 0], // /14
        [255, 254, 0, 0], // /15
        [255, 255, 0, 0], // /16
        [255, 255, 128, 0], // /17
        [255, 255, 192, 0], // /18
        [255, 255, 224, 0], // /19
        [255, 255, 240, 0], // /20
        [255, 255, 248, 0], // /21
        [255, 255, 252, 0], // /22
        [255, 255, 254, 0], // /23
        [255, 255, 255, 0], // /24
        [255, 255, 255, 128], // /25
        [255, 255, 255, 192], // /26
        [255, 255, 255, 224], // /27
        [255, 255, 255, 240], // /28
        [255, 255, 255, 248], // /29
        [255, 255, 255, 252], // /30
        [255, 255, 255, 254], // /31
        [255, 255, 255, 255], // /32
      ];

      for (let prefix = 0; prefix <= 32; prefix++) {
        expect(getIPv4Mask(prefix)).toEqual(expectedMasks[prefix]);
      }
    });
  });

  describe("RFC-specific examples", () => {
    it("should generate mask for RFC 1918 private networks", () => {
      expect(getIPv4Mask(8)).toEqual([255, 0, 0, 0]); // 10.0.0.0/8
      expect(getIPv4Mask(12)).toEqual([255, 240, 0, 0]); // 172.16.0.0/12
      expect(getIPv4Mask(16)).toEqual([255, 255, 0, 0]); // 192.168.0.0/16
    });

    it("should generate mask for RFC 6598 CGN space", () => {
      expect(getIPv4Mask(10)).toEqual([255, 192, 0, 0]); // 100.64.0.0/10
    });

    it("should generate mask for RFC 5771 multicast", () => {
      expect(getIPv4Mask(4)).toEqual([240, 0, 0, 0]); // 224.0.0.0/4
    });
  });
});
