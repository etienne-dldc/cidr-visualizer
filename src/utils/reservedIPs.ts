import type { IPv4CIDR, IPv6CIDR } from "./ipv4";

export interface ReservedIPInfo {
  name: string;
  description: string;
  rfc?: string;
}

interface IPv4ReservedRange {
  cidr: string;
  info: ReservedIPInfo;
}

interface IPv6ReservedRange {
  cidr: string;
  info: ReservedIPInfo;
}

export const RESERVED_IPV4_RANGES: IPv4ReservedRange[] = [
  {
    cidr: "0.0.0.0/8",
    info: {
      name: "This network",
      description: "Current network (only valid as source address)",
      rfc: "RFC 1122",
    },
  },
  {
    cidr: "10.0.0.0/8",
    info: {
      name: "Private network",
      description: "Used for private networks (Class A)",
      rfc: "RFC 1918",
    },
  },
  {
    cidr: "100.64.0.0/10",
    info: {
      name: "Shared address space",
      description: "Used for carrier-grade NAT (CGNAT)",
      rfc: "RFC 6598",
    },
  },
  {
    cidr: "127.0.0.0/8",
    info: {
      name: "Loopback",
      description: "Used for loopback addresses to the local host",
      rfc: "RFC 1122",
    },
  },
  {
    cidr: "169.254.0.0/16",
    info: {
      name: "Link-local",
      description: "Used for link-local addresses between two hosts on a single link",
      rfc: "RFC 3927",
    },
  },
  {
    cidr: "172.16.0.0/12",
    info: {
      name: "Private network",
      description: "Used for private networks (Class B)",
      rfc: "RFC 1918",
    },
  },
  {
    cidr: "192.0.0.0/24",
    info: {
      name: "IETF Protocol Assignments",
      description: "Reserved for IETF Protocol Assignments",
      rfc: "RFC 6890",
    },
  },
  {
    cidr: "192.0.2.0/24",
    info: {
      name: "TEST-NET-1",
      description: "Reserved for documentation and examples",
      rfc: "RFC 5737",
    },
  },
  {
    cidr: "192.88.99.0/24",
    info: {
      name: "Reserved",
      description: "Former IPv6 to IPv4 relay (deprecated)",
      rfc: "RFC 7526",
    },
  },
  {
    cidr: "192.168.0.0/16",
    info: {
      name: "Private network",
      description: "Used for private networks (Class C)",
      rfc: "RFC 1918",
    },
  },
  {
    cidr: "198.18.0.0/15",
    info: {
      name: "Benchmarking",
      description: "Used for testing of inter-network communications between subnets",
      rfc: "RFC 2544",
    },
  },
  {
    cidr: "198.51.100.0/24",
    info: {
      name: "TEST-NET-2",
      description: "Reserved for documentation and examples",
      rfc: "RFC 5737",
    },
  },
  {
    cidr: "203.0.113.0/24",
    info: {
      name: "TEST-NET-3",
      description: "Reserved for documentation and examples",
      rfc: "RFC 5737",
    },
  },
  {
    cidr: "224.0.0.0/4",
    info: {
      name: "Multicast",
      description: "Reserved for multicast addresses",
      rfc: "RFC 5771",
    },
  },
  {
    cidr: "233.252.0.0/24",
    info: {
      name: "MCAST-TEST-NET",
      description: "Reserved for multicast testing and documentation",
      rfc: "RFC 6676",
    },
  },
  {
    cidr: "240.0.0.0/4",
    info: {
      name: "Reserved",
      description: "Reserved for future use",
      rfc: "RFC 1112",
    },
  },
  {
    cidr: "255.255.255.255/32",
    info: {
      name: "Broadcast",
      description: "Reserved for limited broadcast destination address",
      rfc: "RFC 919",
    },
  },
];

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
 * Parse a CIDR notation string to extract the network address and prefix length
 */
function parseCIDR(cidr: string): { parts: number[]; prefixLength: number; isIPv6: boolean } {
  const [address, prefix] = cidr.split("/");
  const prefixLength = parseInt(prefix, 10);

  if (address.includes(":")) {
    // IPv6
    const expandedAddress = expandIPv6(address);
    const parts = expandedAddress.split(":").map((part) => parseInt(part, 16));
    return { parts, prefixLength, isIPv6: true };
  } else {
    // IPv4
    const parts = address.split(".").map((part) => parseInt(part, 10));
    return { parts, prefixLength, isIPv6: false };
  }
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
 * Check if an IPv4 address matches a reserved range
 */
export function checkIPv4Reserved(ipv4: IPv4CIDR): ReservedIPInfo | null {
  const [p1, p2, p3, p4] = ipv4;

  for (const range of RESERVED_IPV4_RANGES) {
    const { parts, prefixLength } = parseCIDR(range.cidr);

    // Convert both addresses to 32-bit integers for comparison
    const ipInt = (p1 << 24) | (p2 << 16) | (p3 << 8) | p4;
    const rangeInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];

    // Create a mask for the prefix length
    const mask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;

    // Check if the IP is in this range
    if ((ipInt & mask) === (rangeInt & mask)) {
      return range.info;
    }
  }

  return null;
}

/**
 * Check if an IPv6 address matches a reserved range
 */
export function checkIPv6Reserved(ipv6: IPv6CIDR): ReservedIPInfo | null {
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
      return range.info;
    }
  }

  return null;
}
