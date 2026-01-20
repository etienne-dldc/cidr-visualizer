export type IPv4 = [p1: number, p2: number, p3: number, p4: number];
export type IPv4CIDR = [
  p1: number,
  p2: number,
  p3: number,
  p4: number,
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

/**
 * Generate a random IPv4 CIDR by randomizing only the host bits (after the prefix)
 * @param ipv4 - Current IPv4 CIDR
 * @returns Random IPv4 CIDR with randomized host bits
 */
export function generateRandomIPv4InNetwork(ipv4: IPv4CIDR): IPv4CIDR {
  const [p1, p2, p3, p4, prefixLength] = ipv4;
  const currentBytes: number[] = [p1, p2, p3, p4];

  // Get the network mask
  const mask = getIPv4Mask(prefixLength);

  // Create an inverse mask to identify host bits
  const hostMask: number[] = mask.map((m) => ~m & 0xff);

  // Generate random bytes and extract only host bits
  const randomBytes: number[] = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];

  const newBytes: number[] = randomBytes.map(
    (byte, index) =>
      (currentBytes[index] & mask[index]) | (byte & hostMask[index]),
  );

  return [newBytes[0], newBytes[1], newBytes[2], newBytes[3], prefixLength];
}
