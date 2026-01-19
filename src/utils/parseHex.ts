import { clamp } from "./number";

export function parseHexPart(part: string, max: number): number | null {
  if (!part) {
    return 0;
  }
  const num = parseInt(part, 16);
  if (isNaN(num)) {
    return null;
  }
  return clamp(num, 0, max);
}
