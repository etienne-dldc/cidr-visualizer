import { detectIPType } from "../utils/detectIPType";
import { useAppState } from "./AppStateProvider";
import { DisplayInput, InputPart } from "./InputPart";

export interface IPv4InputProps {
  highlightedCell?: number | "prefix" | null;
  onHighlight?: (cell: number | "prefix" | null) => void;
}

export function IPv4Input({ highlightedCell, onHighlight }: IPv4InputProps) {
  const { ipv4, dispatch } = useAppState();

  const [part1, part2, part3, part4, prefixLength] = ipv4;

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const detection = detectIPType(pastedText);

    // Try IPv4 first (since we're in IPv4 input)
    if (detection.ipv4) {
      dispatch({ kind: "SetIPv4", ipv4: detection.ipv4 });
      e.preventDefault();
      (document.activeElement as HTMLInputElement)?.blur();
      return;
    }

    // If IPv4 didn't work but IPv6 did, switch mode and pass the IPv6 data
    if (detection.ipv6) {
      dispatch({ kind: "SetIPv6", ipv6: detection.ipv6 });
      e.preventDefault();
      (document.activeElement as HTMLInputElement)?.blur();
      return;
    }
  };

  return (
    <div className="relative flex flex-row align-baseline text-3xl sm:text-5xl" onPaste={handlePaste}>
      <InputPart
        value={part1}
        onChange={(value) => dispatch({ kind: "SetIPv4", ipv4: [value, part2, part3, part4, prefixLength] })}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
        isHighlighted={highlightedCell === 0}
        highlightedClass={highlightedCell === 0 ? "bg-red-400" : null}
        onHighlight={() => onHighlight?.(0)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value="." />
      <InputPart
        value={part2}
        onChange={(value) => dispatch({ kind: "SetIPv4", ipv4: [part1, value, part3, part4, prefixLength] })}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
        isHighlighted={highlightedCell === 1}
        highlightedClass={highlightedCell === 1 ? "bg-orange-400" : null}
        onHighlight={() => onHighlight?.(1)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value="." />
      <InputPart
        value={part3}
        onChange={(value) => dispatch({ kind: "SetIPv4", ipv4: [part1, part2, value, part4, prefixLength] })}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
        isHighlighted={highlightedCell === 2}
        highlightedClass={highlightedCell === 2 ? "bg-amber-400" : null}
        onHighlight={() => onHighlight?.(2)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value="." />
      <InputPart
        value={part4}
        onChange={(value) => dispatch({ kind: "SetIPv4", ipv4: [part1, part2, part3, value, prefixLength] })}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
        isHighlighted={highlightedCell === 3}
        highlightedClass={highlightedCell === 3 ? "bg-yellow-400" : null}
        onHighlight={() => onHighlight?.(3)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value="/" />
      <InputPart
        value={prefixLength}
        onChange={(value) => dispatch({ kind: "SetIPv4", ipv4: [part1, part2, part3, part4, value] })}
        max={32}
        shiftStep={4}
        isHexadecimal={false}
        isHighlighted={highlightedCell === "prefix"}
        highlightedClass={highlightedCell === "prefix" ? "bg-gray-400" : null}
        onHighlight={() => onHighlight?.("prefix")}
        onUnhighlight={() => onHighlight?.(null)}
      />
    </div>
  );
}
