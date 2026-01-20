import type { IPv4CIDR } from "./ipv4";
import type { ReservedIPInfo, ReservedIPMatch } from "./reservedIPTypes";

interface IPv4ReservedRange {
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

/**
 * Parse an IPv4 CIDR notation string to extract the network address and prefix length
 */
function parseCIDR(cidr: string): { parts: number[]; prefixLength: number } {
  const [address, prefix] = cidr.split("/");
  const prefixLength = parseInt(prefix, 10);
  const parts = address.split(".").map((part) => parseInt(part, 10));
  return { parts, prefixLength };
}

/**
 * Check if an IPv4 address matches a reserved range
 * Returns the most specific match (longest prefix length)
 */
export function checkIPv4Reserved(ipv4: IPv4CIDR): ReservedIPMatch | null {
  const [p1, p2, p3, p4] = ipv4;
  const ipInt = (p1 << 24) | (p2 << 16) | (p3 << 8) | p4;

  let bestMatch: { range: IPv4ReservedRange; prefixLength: number } | null = null;

  for (const range of RESERVED_IPV4_RANGES) {
    const { parts, prefixLength } = parseCIDR(range.cidr);

    // Convert range address to 32-bit integer for comparison
    const rangeInt = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];

    // Create a mask for the prefix length
    const mask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;

    // Check if the IP is in this range
    if ((ipInt & mask) === (rangeInt & mask)) {
      // Keep the match with the longest prefix (most specific)
      if (!bestMatch || prefixLength > bestMatch.prefixLength) {
        bestMatch = { range, prefixLength };
      }
    }
  }

  return bestMatch ? { ...bestMatch.range.info, cidr: bestMatch.range.cidr } : null;
}

// Re-export types for convenience
export type { ReservedIPInfo, ReservedIPMatch } from "./reservedIPTypes";

