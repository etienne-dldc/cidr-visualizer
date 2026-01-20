import type { IPv6CIDR } from "../utils/ipv4";
import { PartBits } from "./PartBits";

export interface IPv6BitsProps {
  ipv6: IPv6CIDR;
  mask: [number, number, number, number, number, number, number, number];
  highlightedCell?: number | "prefix" | null;
  onHighlight?: (cell: number | null) => void;
}

export function IPv6Bits({ ipv6, mask, highlightedCell, onHighlight }: IPv6BitsProps) {
  const [p1, p2, p3, p4, p5, p6, p7, p8] = ipv6;
  const [m1, m2, m3, m4, m5, m6, m7, m8] = mask;

  const highlightedPrefixClass = highlightedCell === "prefix" ? "bg-gray-400" : null;

  return (
    <div className="grid grid-cols-2 gap-8 gap-y-4 text-2xl">
      <PartBits
        part={p1}
        mask={m1}
        length={16}
        highlightedClass={highlightedCell === 0 ? "bg-red-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(0)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p2}
        mask={m2}
        length={16}
        highlightedClass={highlightedCell === 1 ? "bg-orange-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(1)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p3}
        mask={m3}
        length={16}
        highlightedClass={highlightedCell === 2 ? "bg-amber-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(2)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p4}
        mask={m4}
        length={16}
        highlightedClass={highlightedCell === 3 ? "bg-yellow-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(3)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p5}
        mask={m5}
        length={16}
        highlightedClass={highlightedCell === 4 ? "bg-lime-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(4)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p6}
        mask={m6}
        length={16}
        highlightedClass={highlightedCell === 5 ? "bg-green-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(5)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p7}
        mask={m7}
        length={16}
        highlightedClass={highlightedCell === 6 ? "bg-emerald-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(6)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={p8}
        mask={m8}
        length={16}
        highlightedClass={highlightedCell === 7 ? "bg-teal-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(7)}
        onUnhighlight={() => onHighlight?.(null)}
      />
    </div>
  );
}
