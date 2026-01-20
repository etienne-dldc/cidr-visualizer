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

  // Calculate netmask
  const netmask: IPv4 = [0, 0, 0, 0];
  for (let i = 0; i < prefixLength; i++) {
    const octetIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    netmask[octetIndex] |= 1 << bitIndex;
  }

  // Convert to 32-bit number and apply netmask to get base address
  const inputNum = (p1 << 24) | (p2 << 16) | (p3 << 8) | p4;
  const hostBits = 32 - prefixLength;
  const networkMask = (0xffffffff << hostBits) & 0xffffffff;
  const baseNum = inputNum & networkMask;

  // Get the masked baseIP
  const baseIP: IPv4 = [
    (baseNum >>> 24) & 0xff,
    (baseNum >>> 16) & 0xff,
    (baseNum >>> 8) & 0xff,
    baseNum & 0xff,
  ];

  // Calculate broadcast IP
  const inverseMask = (1 << hostBits) - 1;
  const broadcastNum = baseNum | inverseMask;
  const broadcastIP: IPv4 = [
    (broadcastNum >>> 24) & 0xff,
    (broadcastNum >>> 16) & 0xff,
    (broadcastNum >>> 8) & 0xff,
    broadcastNum & 0xff,
  ];

  // Calculate count
  const count = BigInt(1) << BigInt(hostBits);

  // Calculate first and last usable IPs
  let firstUsableIP: IPv4 | null = null;
  let lastUsableIP: IPv4 | null = null;

  if (prefixLength < 31) {
    // First usable is the network address (baseIP)
    firstUsableIP = baseIP;

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

  // Calculate netmask
  const netmask: IPv6 = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < prefixLength; i++) {
    const partIndex = Math.floor(i / 16);
    const bitIndex = 15 - (i % 16);
    netmask[partIndex] |= 1 << bitIndex;
  }

  // Apply netmask to input to get base address (clear host bits)
  const baseIP: IPv6 = [p1, p2, p3, p4, p5, p6, p7, p8];
  for (let i = 0; i < 8; i++) {
    baseIP[i] = baseIP[i] & netmask[i];
  }

  // For IPv6, broadcast is the same as the last address in the network
  // which is base with all host bits set to 1
  const broadcastIP: IPv6 = [...baseIP] as IPv6;
  const hostBits = 128 - prefixLength;

  // Apply inverse mask to each part
  for (let i = 0; i < 8; i++) {
    const startBit = i * 16;
    const endBit = startBit + 16;
    const hostStartBit = prefixLength;

    if (endBit <= hostStartBit) {
      // This part is entirely in the network bits, skip it
      continue;
    }

    if (startBit >= hostStartBit) {
      // This part is entirely in the host bits, set all to 1
      broadcastIP[i] = 0xffff;
    } else {
      // This part is partially in the host bits
      const bitsInHost = endBit - hostStartBit;
      const inverseMask = (1 << bitsInHost) - 1;
      broadcastIP[i] |= inverseMask;
    }
  }

  // Calculate count
  const count = BigInt(1) << BigInt(hostBits);

  // Calculate first and last usable IPs
  let firstUsableIP: IPv6 | null = null;
  let lastUsableIP: IPv6 | null = null;

  if (prefixLength < 127) {
    // First usable is the network address (baseIP)
    firstUsableIP = baseIP;

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
