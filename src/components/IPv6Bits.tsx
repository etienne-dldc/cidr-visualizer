import type { IPv6CIDR } from "../utils/ipv4";
import { cn } from "../utils/styles";

export interface IPv6BitsProps {
  ipv6: IPv6CIDR;
}

export function IPv6Bits({ ipv6 }: IPv6BitsProps) {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = ipv6;

  return (
    <div className="grid grid-cols-2 gap-8 text-2xl">
      <PartBits part={p1} prefixLength={prefixLength - 112} />
      <PartBits part={p2} prefixLength={prefixLength - 96} />
      <PartBits part={p3} prefixLength={prefixLength - 80} />
      <PartBits part={p4} prefixLength={prefixLength - 64} />
      <PartBits part={p5} prefixLength={prefixLength - 48} />
      <PartBits part={p6} prefixLength={prefixLength - 32} />
      <PartBits part={p7} prefixLength={prefixLength - 16} />
      <PartBits part={p8} prefixLength={prefixLength} />
    </div>
  );
}

interface PartBitsProps {
  part: number;
  prefixLength: number;
}

export function PartBits({ part, prefixLength }: PartBitsProps) {
  const bits = part.toString(2).padStart(16, "0").split("");
  return (
    <div className="grid grid-cols-16 gap-1">
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
