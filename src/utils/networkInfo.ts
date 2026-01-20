import type { IPv4, IPv4CIDR, IPv6, IPv6CIDR } from "./ipv4";

export interface IPv4NetworkInfo {
  netmask: IPv4;
  baseIP: IPv4;
  broadcastIP: IPv4;
  count: bigint;
  firstUsableIP: IPv4 | null;
  lastUsableIP: IPv4 | null;
}

export interface IPv6NetworkInfo {
  netmask: IPv6;
  baseIP: IPv6;
  broadcastIP: IPv6;
  count: bigint;
  firstUsableIP: IPv6 | null;
  lastUsableIP: IPv6 | null;
}

export function calculateIPv4NetworkInfo(cidr: IPv4CIDR): IPv4NetworkInfo {
  const [p1, p2, p3, p4, prefixLength] = cidr;
  const baseIP: IPv4 = [p1, p2, p3, p4];

  // Calculate netmask
  const netmask: IPv4 = [0, 0, 0, 0];
  for (let i = 0; i < prefixLength; i++) {
    const octetIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    netmask[octetIndex] |= 1 << bitIndex;
  }

  // Calculate broadcast IP
  const broadcastIP: IPv4 = [...baseIP] as IPv4;
  const hostBits = 32 - prefixLength;
  const inverseMask = (1 << hostBits) - 1;

  // Convert to 32-bit number, apply inverse mask, convert back
  const baseNum = (p1 << 24) | (p2 << 16) | (p3 << 8) | p4;
  const broadcastNum = baseNum | inverseMask;
  broadcastIP[0] = (broadcastNum >>> 24) & 0xff;
  broadcastIP[1] = (broadcastNum >>> 16) & 0xff;
  broadcastIP[2] = (broadcastNum >>> 8) & 0xff;
  broadcastIP[3] = broadcastNum & 0xff;

  // Calculate count
  const count = BigInt(1) << BigInt(hostBits);

  // Calculate first and last usable IPs
  let firstUsableIP: IPv4 | null = null;
  let lastUsableIP: IPv4 | null = null;

  if (prefixLength < 31) {
    // First usable is base + 1
    const firstNum = baseNum + 1;
    firstUsableIP = [
      (firstNum >>> 24) & 0xff,
      (firstNum >>> 16) & 0xff,
      (firstNum >>> 8) & 0xff,
      firstNum & 0xff,
    ];

    // Last usable is broadcast - 1
    const lastNum = broadcastNum - 1;
    lastUsableIP = [
      (lastNum >>> 24) & 0xff,
      (lastNum >>> 16) & 0xff,
      (lastNum >>> 8) & 0xff,
      lastNum & 0xff,
    ];
  } else if (prefixLength === 31) {
    // /31 is point-to-point, both are usable
    firstUsableIP = baseIP;
    lastUsableIP = broadcastIP;
  }
  // /32 has no usable IPs (single host)

  return {
    netmask,
    baseIP,
    broadcastIP,
    count,
    firstUsableIP,
    lastUsableIP,
  };
}

export function calculateIPv6NetworkInfo(cidr: IPv6CIDR): IPv6NetworkInfo {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = cidr;
  const baseIP: IPv6 = [p1, p2, p3, p4, p5, p6, p7, p8];

  // Calculate netmask
  const netmask: IPv6 = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < prefixLength; i++) {
    const partIndex = Math.floor(i / 16);
    const bitIndex = 15 - (i % 16);
    netmask[partIndex] |= 1 << bitIndex;
  }

  // For IPv6, broadcast is typically the same as the last address in the network
  // which is base with all host bits set to 1
  const broadcastIP: IPv6 = [...baseIP] as IPv6;
  const hostBits = 128 - prefixLength;

  // Apply inverse mask to each part
  for (let i = 0; i < 8; i++) {
    const bitsInPart = Math.min(16, Math.max(0, hostBits - i * 16));
    if (bitsInPart > 0) {
      const inverseMask = (1 << bitsInPart) - 1;
      broadcastIP[i] |= inverseMask;
    }
  }

  // Calculate count
  const count = BigInt(1) << BigInt(hostBits);

  // Calculate first and last usable IPs
  let firstUsableIP: IPv6 | null = null;
  let lastUsableIP: IPv6 | null = null;

  if (prefixLength < 127) {
    // First usable is base + 1
    const firstUsable = [...baseIP] as IPv6;
    let carry = 1;
    for (let i = 7; i >= 0 && carry > 0; i--) {
      const sum = firstUsable[i] + carry;
      firstUsable[i] = sum & 0xffff;
      carry = sum >> 16;
    }
    firstUsableIP = firstUsable;

    // Last usable is broadcast - 1
    const lastUsable = [...broadcastIP] as IPv6;
    let borrow = 1;
    for (let i = 7; i >= 0 && borrow > 0; i--) {
      const diff = lastUsable[i] - borrow;
      if (diff < 0) {
        lastUsable[i] = (diff + 0x10000) & 0xffff;
        borrow = 1;
      } else {
        lastUsable[i] = diff;
        borrow = 0;
      }
    }
    lastUsableIP = lastUsable;
  } else if (prefixLength === 127) {
    // /127 is point-to-point
    firstUsableIP = baseIP;
    lastUsableIP = broadcastIP;
  }
  // /128 has no usable IPs (single host)

  return {
    netmask,
    baseIP,
    broadcastIP,
    count,
    firstUsableIP,
    lastUsableIP,
  };
}

export function formatIPv4(ip: IPv4): string {
  return `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
}

export function formatCount(count: bigint): string {
  return new Intl.NumberFormat("en-US").format(count);
}
