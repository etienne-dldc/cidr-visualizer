import { cn } from "../utils/styles";

export interface PartBitsProps {
  part: number;
  prefixLength: number;
  index: number;
  bitWidth: number;
  highlightedPrefixClass: string | null;
  highlightedClass: string | null;
  onHighlight?: () => void;
  onUnhighlight?: () => void;
}

export function PartBits({
  part,
  prefixLength,
  bitWidth,
  highlightedClass,
  highlightedPrefixClass,
  onHighlight,
  onUnhighlight,
}: PartBitsProps) {
  const bits = part.toString(2).padStart(bitWidth, "0").split("");
  const gridColsClass = bitWidth === 8 ? "grid-cols-8" : "grid-cols-16";
  const maxPrefixLength = Math.min(prefixLength, bitWidth);

  return (
    <div
      className={cn("grid grid-flow-col grid-cols-[repeat(8,auto)]", gridColsClass)}
      onMouseEnter={onHighlight}
      onMouseLeave={onUnhighlight}
    >
      {bits.map((bit, index) => {
        const isFirst = index === 0;
        const isLast = index === bits.length - 1;
        const isPrefix = index >= bits.length - maxPrefixLength;
        const isFirstPrefix = index === bits.length - maxPrefixLength;
        let roundedClass = "";
        if (highlightedPrefixClass) {
          if (isFirstPrefix && isLast) {
            roundedClass = "rounded";
          } else if (isFirstPrefix) {
            roundedClass = "rounded-l";
          } else if (isLast) {
            roundedClass = "rounded-r";
          }
        } else if (highlightedClass) {
          if (isFirst && isLast) {
            roundedClass = "rounded";
          } else if (isFirst) {
            roundedClass = "rounded-l";
          } else if (isLast) {
            roundedClass = "rounded-r";
          }
        }

        return (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center px-1.5 py-1 leading-none",
              // isFirst && "pl-4",
              // isLast && "pr-4",
              highlightedClass,
              isPrefix && highlightedPrefixClass,
              roundedClass,
            )}
          >
            <span className={isPrefix ? "opacity-50" : undefined}>{bit}</span>
          </div>
        );
      })}
    </div>
  );
}
