import type { IPv4, IPv4CIDR } from "./types";

export interface IPv4NetworkInfo {
  mode: "IPv4";
  netmask: IPv4;
  baseIP: IPv4;
  broadcastIP: IPv4 | null;
  count: bigint;
  firstUsableIP: IPv4 | null;
  lastUsableIP: IPv4 | null;
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
  // Handle edge case where hostBits >= 32 (shift wraps around in JavaScript)
  const networkMask =
    hostBits >= 32 ? 0 : (0xffffffff << hostBits) & 0xffffffff;
  const baseNum = inputNum & networkMask;

  // Get the masked baseIP
  const baseIP: IPv4 = [
    (baseNum >>> 24) & 0xff,
    (baseNum >>> 16) & 0xff,
    (baseNum >>> 8) & 0xff,
    baseNum & 0xff,
  ];

  // Calculate broadcast IP
  // Handle edge case where hostBits >= 32 (use BigInt to avoid overflow)
  let inverseMask: number;
  if (hostBits >= 32) {
    inverseMask = 0xffffffff;
  } else {
    inverseMask = (1 << hostBits) - 1;
  }
  const broadcastNum = baseNum | inverseMask;

  // /31 and /32 don't have broadcast addresses
  let broadcastIP: IPv4 | null = null;
  if (prefixLength < 31) {
    broadcastIP = [
      (broadcastNum >>> 24) & 0xff,
      (broadcastNum >>> 16) & 0xff,
      (broadcastNum >>> 8) & 0xff,
      broadcastNum & 0xff,
    ];
  }

  // Calculate count
  const count = BigInt(1) << BigInt(hostBits);

  // Calculate first and last usable IPs
  let firstUsableIP: IPv4 | null = null;
  let lastUsableIP: IPv4 | null = null;

  if (prefixLength < 31) {
    // First usable is base + 1 (skip network address)
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
    // /31 is point-to-point, both addresses are usable (no broadcast)
    firstUsableIP = baseIP;
    // Last usable is the address with all host bits set to 1
    const lastNum = baseNum | inverseMask;
    lastUsableIP = [
      (lastNum >>> 24) & 0xff,
      (lastNum >>> 16) & 0xff,
      (lastNum >>> 8) & 0xff,
      lastNum & 0xff,
    ];
  }
  // /32 has no usable IPs (single host)

  return {
    mode: "IPv4",
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
