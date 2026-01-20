import type { IPv6, IPv6CIDR } from "./ipv6";

export interface IPv6NetworkInfo {
  mode: "IPv6";
  netmask: IPv6;
  baseIP: IPv6;
  broadcastIP: IPv6 | null;
  count: bigint;
  firstUsableIP: IPv6 | null;
  lastUsableIP: IPv6 | null;
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

  // Helper function to set all host bits to 1
  const setAllHostBitsTo1 = (): IPv6 => {
    const result = [...baseIP] as IPv6;
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
        result[i] = 0xffff;
      } else {
        // This part is partially in the host bits
        const bitsInHost = endBit - hostStartBit;
        const inverseMask = (1 << bitsInHost) - 1;
        result[i] |= inverseMask;
      }
    }
    return result;
  };

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
    lastUsableIP = setAllHostBitsTo1();
  } else if (prefixLength === 127) {
    // /127 is point-to-point, both addresses are usable (no broadcast)
    firstUsableIP = baseIP;
    // Last usable is the address with all host bits set to 1
    lastUsableIP = setAllHostBitsTo1();
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
