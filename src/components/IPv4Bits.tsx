import type { IPv4CIDR } from "../utils/ipv4";
import { PartBits } from "./PartBits";

import type { IPv4 } from "../utils/ipv4";

export interface IPv4BitsProps {
  ipv4: IPv4CIDR;
  mask: IPv4;
  highlightedCell?: number | "prefix" | null;
  onHighlight?: (cell: number | "prefix" | null) => void;
}

export function IPv4Bits({ ipv4, mask, highlightedCell, onHighlight }: IPv4BitsProps) {
  const [part1, part2, part3, part4] = ipv4;
  const [mask1, mask2, mask3, mask4] = mask;

  const highlightedPrefixClass = highlightedCell === "prefix" ? "bg-gray-400" : null;

  return (
    <div className="grid grid-cols-4 gap-8 text-2xl">
      <PartBits
        part={part1}
        mask={mask1}
        length={8}
        highlightedClass={highlightedCell === 0 ? "bg-red-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(0)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={part2}
        mask={mask2}
        length={8}
        highlightedClass={highlightedCell === 1 ? "bg-orange-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(1)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={part3}
        mask={mask3}
        length={8}
        highlightedClass={highlightedCell === 2 ? "bg-amber-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(2)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={part4}
        mask={mask4}
        length={8}
        highlightedClass={highlightedCell === 3 ? "bg-yellow-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(3)}
        onUnhighlight={() => onHighlight?.(null)}
      />
    </div>
  );
}
