/**
 * Convert an IPv6 CIDR prefix length to a network mask
 * @param prefixLength - CIDR prefix length (0-128)
 * @returns IPv6 mask as [p1, p2, p3, p4, p5, p6, p7, p8]
 */
export function getIPv6Mask(
  prefixLength: number,
): [number, number, number, number, number, number, number, number] {
  const mask: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < prefixLength; i++) {
    const partIndex = Math.floor(i / 16);
    const bitIndex = 15 - (i % 16);
    mask[partIndex] |= 1 << bitIndex;
  }

  return mask as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}
