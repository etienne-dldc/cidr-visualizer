import { getIPv6Mask } from "./mask";
import type { IPv6CIDR } from "./types";

/**
 * Generate a random IPv6 CIDR by randomizing host bits and setting network bits to 0
 * @param prefixLength - CIDR prefix length (0-128)
 * @returns Random IPv6 CIDR with the given prefix length
 */
export function generateRandomIPv6CIDR(prefixLength: number): IPv6CIDR {
  // Generate random 16-bit parts
  const randomParts: number[] = [
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
  ];

  // Get the network mask to zero out host bits
  const mask = getIPv6Mask(prefixLength);

  // Apply mask to keep network bits and randomize host bits
  const maskedParts: number[] = randomParts.map(
    (part, index) => part & mask[index],
  );

  return [
    maskedParts[0],
    maskedParts[1],
    maskedParts[2],
    maskedParts[3],
    maskedParts[4],
    maskedParts[5],
    maskedParts[6],
    maskedParts[7],
    prefixLength,
  ];
}

/**
 * Generate a random IPv6 CIDR by randomizing only the host bits (after the prefix)
 * @param ipv6 - Current IPv6 CIDR
 * @returns Random IPv6 CIDR with randomized host bits
 */
export function generateRandomIPv6InNetwork(ipv6: IPv6CIDR): IPv6CIDR {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = ipv6;
  const currentParts: number[] = [p1, p2, p3, p4, p5, p6, p7, p8];

  // Get the network mask
  const mask = getIPv6Mask(prefixLength);

  // Create an inverse mask to identify host bits
  const hostMask: number[] = mask.map((m) => ~m & 0xffff);

  // Generate random parts and extract only host bits
  const randomParts: number[] = [
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
    Math.floor(Math.random() * 65536),
  ];

  const newParts: number[] = randomParts.map(
    (part, index) =>
      (currentParts[index] & mask[index]) | (part & hostMask[index]),
  );

  return [
    newParts[0],
    newParts[1],
    newParts[2],
    newParts[3],
    newParts[4],
    newParts[5],
    newParts[6],
    newParts[7],
    prefixLength,
  ];
}
