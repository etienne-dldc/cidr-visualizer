import { clamp } from "./number";

export function parseDecimalPart(part: string, max: number): number | null {
  if (!part) {
    return 0;
  }
  const num = parseInt(part, 10);
  if (isNaN(num)) {
    return null;
  }
  return clamp(num, 0, max);
}
