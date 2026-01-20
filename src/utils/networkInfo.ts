import type { IPv4, IPv4CIDR, IPv6, IPv6CIDR } from "./ipv4";

export interface IPv4NetworkInfo {
  mode: "IPv4";
  netmask: IPv4;
  baseIP: IPv4;
  broadcastIP: IPv4 | null;
  count: bigint;
  firstUsableIP: IPv4 | null;
  lastUsableIP: IPv4 | null;
}

export interface IPv6NetworkInfo {
  mode: "IPv6";
  netmask: IPv6;
  baseIP: IPv6;
  broadcastIP: IPv6 | null;
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
    // Last usable is base + 1
    const lastNum = baseNum + 1;
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

  // For IPv6, broadcast addresses don't exist (IPv6 uses multicast instead)
  const broadcastIP: IPv6 | null = null;
  const hostBits = 128 - prefixLength;

  // Calculate count
  const count = BigInt(1) << BigInt(hostBits);

  // Calculate first and last usable IPs
  let firstUsableIP: IPv6 | null = null;
  let lastUsableIP: IPv6 | null = null;

  if (prefixLength < 127) {
    // First usable is base + 1 (skip network address)
    const firstUsable = [...baseIP] as IPv6;
    let carry = 1;
    for (let i = 7; i >= 0 && carry > 0; i--) {
      const sum = firstUsable[i] + carry;
      firstUsable[i] = sum & 0xffff;
      carry = sum >> 16;
    }
    firstUsableIP = firstUsable;

    // Last usable is the address with all host bits set to 1
    const lastUsable = [...baseIP] as IPv6;
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
        lastUsable[i] = 0xffff;
      } else {
        // This part is partially in the host bits
        const bitsInHost = endBit - hostStartBit;
        const inverseMask = (1 << bitsInHost) - 1;
        lastUsable[i] |= inverseMask;
      }
    }
    lastUsableIP = lastUsable;
  } else if (prefixLength === 127) {
    // /127 is point-to-point, both addresses are usable (no broadcast)
    firstUsableIP = baseIP;
    // Last usable is base + 1
    const lastUsable = [...baseIP] as IPv6;
    let carry = 1;
    for (let i = 7; i >= 0 && carry > 0; i--) {
      const sum = lastUsable[i] + carry;
      lastUsable[i] = sum & 0xffff;
      carry = sum >> 16;
    }
    lastUsableIP = lastUsable;
  }
  // /128 has no usable IPs (single host)

  return {
    mode: "IPv6",
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
