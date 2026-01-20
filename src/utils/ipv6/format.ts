import type { IPv6, IPv6CIDR } from "./types";

export function formatIPv6(ipv6: IPv6 | IPv6CIDR): string {
  const parts = ipv6.slice(0, 8) as number[];

  // Convert all parts to hex strings
  const hexParts = parts.map((num) => num.toString(16));

  // Find the longest sequence of consecutive zeros
  let longestStart = -1;
  let longestLength = 0;
  let currentStart = -1;
  let currentLength = 0;

  for (let i = 0; i < hexParts.length; i++) {
    if (hexParts[i] === "0") {
      if (currentStart === -1) {
        currentStart = i;
        currentLength = 1;
      } else {
        currentLength++;
      }
    } else {
      if (currentLength > longestLength) {
        longestStart = currentStart;
        longestLength = currentLength;
      }
      currentStart = -1;
      currentLength = 0;
    }
  }

  // Check if the last sequence is the longest
  if (currentLength > longestLength) {
    longestStart = currentStart;
    longestLength = currentLength;
  }

  // Only replace if we found a sequence of at least 2 consecutive zeros
  if (longestLength >= 2) {
    const before = hexParts.slice(0, longestStart);
    const after = hexParts.slice(longestStart + longestLength);

    if (before.length === 0 && after.length === 0) {
      return "::";
    } else if (before.length === 0) {
      return "::" + after.join(":");
    } else if (after.length === 0) {
      return before.join(":") + "::";
    } else {
      return before.join(":") + "::" + after.join(":");
    }
  }

  return hexParts.join(":");
}
