export type IPv4 = [p1: number, p2: number, p3: number, p4: number];
export type IPv4CIDR = [
  p1: number,
  p2: number,
  p3: number,
  p4: number,
  prefixLength: number,
];
export type IPv6 = [
  p1: number,
  p2: number,
  p3: number,
  p4: number,
  p5: number,
  p6: number,
  p7: number,
  p8: number,
];
export type IPv6CIDR = [
  p1: number,
  p2: number,
  p3: number,
  p4: number,
  p5: number,
  p6: number,
  p7: number,
  p8: number,
  prefixLength: number,
];

/**
 * Convert an IPv4 CIDR prefix length to a network mask
 * @param prefixLength - CIDR prefix length (0-32)
 * @returns IPv4 mask as [p1, p2, p3, p4]
 */
export function getIPv4Mask(prefixLength: number): IPv4 {
  const mask: number[] = [0, 0, 0, 0];

  for (let i = 0; i < prefixLength; i++) {
    const octetIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    mask[octetIndex] |= 1 << bitIndex;
  }

  return mask as IPv4;
}

/**
 * Generate a random IPv4 CIDR by randomizing host bits and setting network bits to 0
 * @param prefixLength - CIDR prefix length (0-32)
 * @returns Random IPv4 CIDR with the given prefix length
 */
export function generateRandomIPv4CIDR(prefixLength: number): IPv4CIDR {
  // Generate random bytes
  const randomBytes: number[] = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];

  // Get the network mask to zero out host bits
  const mask = getIPv4Mask(prefixLength);

  // Apply mask to keep network bits and randomize host bits
  const maskedBytes: number[] = randomBytes.map(
    (byte, index) => byte & mask[index],
  );

  return [
    maskedBytes[0],
    maskedBytes[1],
    maskedBytes[2],
    maskedBytes[3],
    prefixLength,
  ];
}
