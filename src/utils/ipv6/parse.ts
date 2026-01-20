import type { IPv6CIDR } from "./types";

export function parseIPv6String(input: string): IPv6CIDR | null {
  const trimmed = input.trim();

  // Split address and prefix
  const parts = trimmed.split("/");
  if (parts.length > 2) {
    return null;
  }

  const addressPart = parts[0];
  const prefixPart = parts[1];

  const prefixLength = prefixPart ? parseInt(prefixPart, 10) : 128;

  // Validate prefix is a valid number
  if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 128) {
    return null;
  }

  // Reject empty prefix (trailing /)
  if (parts.length === 2 && prefixPart === "") {
    return null;
  }

  // Parse IPv6 address
  const groups = parseIPv6Address(addressPart);
  if (!groups || groups.length !== 8) {
    return null;
  }

  return [...groups, prefixLength] as IPv6CIDR;
}

function parseIPv6Address(address: string): number[] | null {
  // Handle :: (zero compression)
  if (address.includes("::")) {
    const parts = address.split("::");
    if (parts.length > 2) {
      return null; // More than one :: is invalid
    }

    const leftParts = parts[0] ? parts[0].split(":").filter((p) => p) : [];
    const rightParts = parts[1] ? parts[1].split(":").filter((p) => p) : [];

    if (leftParts.length + rightParts.length >= 8) {
      return null; // Too many groups
    }

    const zerosCount = 8 - leftParts.length - rightParts.length;
    const allParts = [
      ...leftParts,
      ...Array(zerosCount).fill("0"),
      ...rightParts,
    ];

    const parsed = allParts.map((p) => {
      const num = parseInt(p, 16);
      if (isNaN(num) || num < 0 || num > 0xffff) {
        return null;
      }
      return num;
    });

    // Check if any part failed to parse
    if (parsed.includes(null)) {
      return null;
    }

    return parsed as number[];
  }

  // Regular notation without ::
  const hexParts = address.split(":");
  if (hexParts.length !== 8) {
    return null;
  }

  const parsed = hexParts.map((p) => {
    const num = parseInt(p, 16);
    if (isNaN(num) || num < 0 || num > 0xffff) {
      return null;
    }
    return num;
  });

  // Check if any part failed to parse
  if (parsed.includes(null)) {
    return null;
  }

  return parsed as number[];
}
