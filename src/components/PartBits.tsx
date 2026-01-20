import { cn } from "../utils/shared/styles";

export interface PartBitsProps {
  part: number;
  mask: number;
  length: number;
  highlightedPrefixClass: string | null;
  highlightedClass: string | null;
  onHighlight?: () => void;
  onUnhighlight?: () => void;
}

export function PartBits({
  part,
  mask,
  length,
  highlightedClass,
  highlightedPrefixClass,
  onHighlight,
  onUnhighlight,
}: PartBitsProps) {
  const bits = part.toString(2).padStart(length, "0").split("");
  const maskBits = mask
    .toString(2)
    .padStart(length, "0")
    .split("")
    .map((b) => b === "1");
  const gridColsClass = length === 8 ? "grid-cols-[repeat(8,auto)]" : "grid-cols-[repeat(16,auto)]";

  return (
    <div className={cn("grid justify-center", gridColsClass)} onMouseEnter={onHighlight} onMouseLeave={onUnhighlight}>
      {bits.map((bit, index) => {
        const isFirst = index === 0;
        const isLast = index === bits.length - 1;
        const isMasked = !maskBits[index];
        const isPrevMasked = index > 0 ? !maskBits[index - 1] : false;
        const isNextMasked = index < bits.length - 1 ? !maskBits[index + 1] : false;
        const isFirstMasked = isMasked && !isPrevMasked;
        const isLastMasked = isMasked && !isNextMasked;

        let roundedClass = "";
        if (isMasked && highlightedPrefixClass) {
          if (isFirstMasked && isLastMasked) {
            roundedClass = "rounded";
          } else if (isFirstMasked) {
            roundedClass = "rounded-l";
          } else if (isLastMasked) {
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
              "flex items-center justify-center px-0.5 py-1 leading-none",
              highlightedClass,
              isFirst && "pl-2",
              isLast && "pr-2",
              isMasked && highlightedPrefixClass,
              roundedClass,
            )}
          >
            <span className={isMasked ? "opacity-50" : undefined}>{bit}</span>
          </div>
        );
      })}
    </div>
  );
}
