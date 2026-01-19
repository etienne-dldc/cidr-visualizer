import type { IPv6CIDR } from "../utils/ipv4";
import { PartBits } from "./PartBits";

export interface IPv6BitsProps {
  ipv6: IPv6CIDR;
  highlightedCell?: number | "prefix" | null;
  onHighlight?: (cell: number | null) => void;
}

export function IPv6Bits({ ipv6, highlightedCell, onHighlight }: IPv6BitsProps) {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = ipv6;

  const highlightedPrefixClass = highlightedCell === "prefix" ? "bg-gray-400" : null;

  return (
    <div className="grid grid-cols-2 gap-8 text-2xl">
      <PartBits
        part={p1}
        prefixLength={prefixLength - 112}
        index={0}
        bitWidth={16}
        highlightedClass={highlightedCell === 0 ? "bg-red-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(0)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p2}
        prefixLength={prefixLength - 96}
        index={1}
        bitWidth={16}
        highlightedClass={highlightedCell === 1 ? "bg-orange-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(1)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p3}
        prefixLength={prefixLength - 80}
        index={2}
        bitWidth={16}
        highlightedClass={highlightedCell === 2 ? "bg-amber-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(2)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p4}
        prefixLength={prefixLength - 64}
        index={3}
        bitWidth={16}
        highlightedClass={highlightedCell === 3 ? "bg-yellow-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(3)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p5}
        prefixLength={prefixLength - 48}
        index={4}
        bitWidth={16}
        highlightedClass={highlightedCell === 4 ? "bg-lime-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(4)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p6}
        prefixLength={prefixLength - 32}
        index={5}
        bitWidth={16}
        highlightedClass={highlightedCell === 5 ? "bg-green-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(5)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p7}
        prefixLength={prefixLength - 16}
        index={6}
        bitWidth={16}
        highlightedClass={highlightedCell === 6 ? "bg-emerald-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(6)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p8}
        prefixLength={prefixLength}
        index={7}
        bitWidth={16}
        highlightedClass={highlightedCell === 7 ? "bg-teal-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(7)}
        onUnhighlight={() => onHighlight?.(null)}
      />
    </div>
  );
}
