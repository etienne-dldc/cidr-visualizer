import type { IPv4CIDR } from "../utils/ipv4";
import { cn } from "../utils/styles";

export interface IPv4BitsProps {
  ipv4: IPv4CIDR;
}

export function IPv4Bits({ ipv4 }: IPv4BitsProps) {
  const [part1, part2, part3, part4, prefixLength] = ipv4;

  return (
    <div className="grid grid-cols-4 gap-8 text-2xl">
      <PartBits part={part1} prefixLength={prefixLength - 24} />
      <PartBits part={part2} prefixLength={prefixLength - 16} />
      <PartBits part={part3} prefixLength={prefixLength - 8} />
      <PartBits part={part4} prefixLength={prefixLength} />
    </div>
  );
}

interface PartBitsProps {
  part: number;
  prefixLength: number;
}

export function PartBits({ part, prefixLength }: PartBitsProps) {
  const bits = part.toString(2).padStart(8, "0").split("");
  return (
    <div className="grid grid-cols-8 gap-1">
      {bits.map((bit, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-center rounded leading-none",
            index >= bits.length - prefixLength && "opacity-50",
          )}
        >
          {bit}
        </div>
      ))}
    </div>
  );
}
