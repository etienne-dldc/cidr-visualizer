import type { IPv6CIDR } from "./ipv4";
import type { ReservedIPInfo, ReservedIPMatch } from "./reservedIPTypes";

interface IPv6ReservedRange {
  cidr: string;
  info: ReservedIPInfo;
}

export const RESERVED_IPV6_RANGES: IPv6ReservedRange[] = [
  {
    cidr: "::/128",
    info: {
      name: "Unspecified address",
      description: "Unspecified address (equivalent to 0.0.0.0 in IPv4)",
      rfc: "RFC 4291",
    },
  },
  {
    cidr: "::1/128",
    info: {
      name: "Loopback",
      description: "Loopback address to the local host",
      rfc: "RFC 4291",
    },
  },
  {
    cidr: "::ffff:0:0/96",
    info: {
      name: "IPv4-mapped IPv6 addresses",
      description: "IPv4 addresses mapped to IPv6",
      rfc: "RFC 4291",
    },
  },
  {
    cidr: "64:ff9b::/96",
    info: {
      name: "IPv4/IPv6 translation",
      description: "IPv4/IPv6 translation (well-known prefix for NAT64)",
      rfc: "RFC 6052",
    },
  },
  {
    cidr: "100::/64",
    info: {
      name: "Discard prefix",
      description: "Discard prefix for routing",
      rfc: "RFC 6666",
    },
  },
  {
    cidr: "2001::/23",
    info: {
      name: "IETF Protocol Assignments",
      description: "Reserved for IETF Protocol Assignments",
      rfc: "RFC 2928",
    },
  },
  {
    cidr: "2001:db8::/32",
    info: {
      name: "Documentation",
      description: "Reserved for documentation and examples",
      rfc: "RFC 3849",
    },
  },
  {
    cidr: "fc00::/7",
    info: {
      name: "Unique local address",
      description: "Used for local communications (similar to IPv4 private addresses)",
      rfc: "RFC 4193",
    },
  },
  {
    cidr: "fe80::/10",
    info: {
      name: "Link-local unicast",
      description: "Used for link-local addresses",
      rfc: "RFC 4291",
    },
  },
  {
    cidr: "ff00::/8",
    info: {
      name: "Multicast",
      description: "Reserved for multicast addresses",
      rfc: "RFC 4291",
    },
  },
];

/**
 * Parse an IPv6 CIDR notation string to extract the network address and prefix length
 */
function parseCIDR(cidr: string): { parts: number[]; prefixLength: number } {
  const [address, prefix] = cidr.split("/");
  const prefixLength = parseInt(prefix, 10);
  const expandedAddress = expandIPv6(address);
  const parts = expandedAddress.split(":").map((part) => parseInt(part, 16));
  return { parts, prefixLength };
}

/**
 * Expand an IPv6 address to its full form
 */
function expandIPv6(address: string): string {
  // Handle :: notation
  if (address.includes("::")) {
    const [before, after] = address.split("::");
    const beforeParts = before ? before.split(":").filter((p) => p !== "") : [];
    const afterParts = after ? after.split(":").filter((p) => p !== "") : [];
    const missingParts = 8 - beforeParts.length - afterParts.length;
    const middle = Array(missingParts).fill("0");
    const allParts = [...beforeParts, ...middle, ...afterParts];
    return allParts.map((part) => part.padStart(4, "0")).join(":");
  }

  // Already expanded or simple form
  const parts = address.split(":");
  return parts.map((part) => part.padStart(4, "0")).join(":");
}

/**
 * Check if an IPv6 address matches a reserved range
 */
export function checkIPv6Reserved(ipv6: IPv6CIDR): ReservedIPMatch | null {
  const ipParts = [ipv6[0], ipv6[1], ipv6[2], ipv6[3], ipv6[4], ipv6[5], ipv6[6], ipv6[7]];

  for (const range of RESERVED_IPV6_RANGES) {
    const { parts, prefixLength } = parseCIDR(range.cidr);

    // Compare each 16-bit part
    let matches = true;
    let bitsChecked = 0;

    for (let i = 0; i < 8; i++) {
      const bitsInPart = Math.min(16, prefixLength - bitsChecked);
      if (bitsInPart <= 0) break;

      const ipPart = ipParts[i];
      const rangePart = parts[i] || 0;

      if (bitsInPart === 16) {
        // Compare the whole part
        if (ipPart !== rangePart) {
          matches = false;
          break;
        }
      } else {
        // Compare only the first bitsInPart bits
        const mask = (0xffff << (16 - bitsInPart)) & 0xffff;
        if ((ipPart & mask) !== (rangePart & mask)) {
          matches = false;
          break;
        }
      }

      bitsChecked += 16;
    }

    if (matches) {
      return { ...range.info, cidr: range.cidr };
    }
  }

  return null;
}

// Re-export types for convenience
export type { ReservedIPInfo, ReservedIPMatch } from "./reservedIPTypes";

