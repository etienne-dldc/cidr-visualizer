import type { IPv4CIDR } from "../utils/ipv4";
import { PartBits } from "./PartBits";

export interface IPv4BitsProps {
  ipv4: IPv4CIDR;
  highlightedCell?: number | "prefix" | null;
  onHighlight?: (cell: number | "prefix" | null) => void;
}

export function IPv4Bits({ ipv4, highlightedCell, onHighlight }: IPv4BitsProps) {
  const [part1, part2, part3, part4, prefixLength] = ipv4;

  const highlightedPrefixClass = highlightedCell === "prefix" ? "bg-gray-400" : null;

  return (
    <div className="grid grid-cols-4 gap-8 text-2xl">
      <PartBits
        part={part1}
        prefixLength={prefixLength - 24}
        index={0}
        bitWidth={8}
        highlightedClass={highlightedCell === 0 ? "bg-red-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(0)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={part2}
        prefixLength={prefixLength - 16}
        index={1}
        bitWidth={8}
        highlightedClass={highlightedCell === 1 ? "bg-orange-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(1)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={part3}
        prefixLength={prefixLength - 8}
        index={2}
        bitWidth={8}
        highlightedClass={highlightedCell === 2 ? "bg-amber-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(2)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <PartBits
        part={part4}
        prefixLength={prefixLength}
        index={3}
        bitWidth={8}
        highlightedClass={highlightedCell === 3 ? "bg-yellow-400" : null}
        highlightedPrefixClass={highlightedPrefixClass}
        onHighlight={() => onHighlight?.(3)}
        onUnhighlight={() => onHighlight?.(null)}
      />
    </div>
  );
}
