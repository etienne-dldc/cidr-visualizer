import { detectIPType } from "../utils/detectIPType";
import type { IPv4CIDR, IPv6CIDR } from "../utils/ipv4";
import { DisplayInput, InputPart } from "./InputPart";

export interface IPv6InputProps {
  ipv6: IPv6CIDR;
  onChange: (ipv6: IPv6CIDR) => void;
  highlightedCell?: number | "prefix" | null;
  onHighlight?: (cell: number | "prefix" | null) => void;
  onModeSwitch?: (mode: "IPv4" | "IPv6", ipData: IPv4CIDR | IPv6CIDR) => void;
}

export function IPv6Input({ ipv6, onChange, highlightedCell, onHighlight, onModeSwitch }: IPv6InputProps) {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = ipv6;

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const detection = detectIPType(pastedText);

    // Try IPv6 first (since we're in IPv6 input)
    if (detection.ipv6) {
      onChange(detection.ipv6);
      e.preventDefault();
      (document.activeElement as HTMLInputElement)?.blur();
      return;
    }

    // If IPv6 didn't work but IPv4 did, switch mode and pass the IPv4 data
    if (detection.ipv4 && onModeSwitch) {
      onModeSwitch("IPv4", detection.ipv4);
      e.preventDefault();
      (document.activeElement as HTMLInputElement)?.blur();
      return;
    }
  };

  return (
    <div
      className="relative grid grid-cols-[repeat(8,auto)] text-3xl sm:text-5xl xl:grid-flow-col"
      onPaste={handlePaste}
    >
      <InputPart
        value={p1}
        onChange={(value) => onChange([value, p2, p3, p4, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 0}
        highlightedClass={highlightedCell === 0 ? "bg-red-400" : null}
        onHighlight={() => onHighlight?.(0)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p2}
        onChange={(value) => onChange([p1, value, p3, p4, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 1}
        highlightedClass={highlightedCell === 1 ? "bg-orange-400" : null}
        onHighlight={() => onHighlight?.(1)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p3}
        onChange={(value) => onChange([p1, p2, value, p4, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 2}
        highlightedClass={highlightedCell === 2 ? "bg-amber-400" : null}
        onHighlight={() => onHighlight?.(2)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p4}
        onChange={(value) => onChange([p1, p2, p3, value, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 3}
        highlightedClass={highlightedCell === 3 ? "bg-yellow-400" : null}
        onHighlight={() => onHighlight?.(3)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p5}
        onChange={(value) => onChange([p1, p2, p3, p4, value, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 4}
        highlightedClass={highlightedCell === 4 ? "bg-lime-400" : null}
        onHighlight={() => onHighlight?.(4)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p6}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, value, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 5}
        highlightedClass={highlightedCell === 5 ? "bg-green-400" : null}
        onHighlight={() => onHighlight?.(5)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p7}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, p6, value, p8, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 6}
        highlightedClass={highlightedCell === 6 ? "bg-emerald-400" : null}
        onHighlight={() => onHighlight?.(6)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p8}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, p6, p7, value, prefixLength])}
        max={65535}
        shiftStep={256}
        isHighlighted={highlightedCell === 7}
        highlightedClass={highlightedCell === 7 ? "bg-teal-400" : null}
        onHighlight={() => onHighlight?.(7)}
        onUnhighlight={() => onHighlight?.(null)}
      />
      <DisplayInput value="/" />
      <InputPart
        value={prefixLength}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, p6, p7, p8, value])}
        max={128}
        shiftStep={8}
        isHexadecimal={false}
        isHighlighted={highlightedCell === "prefix"}
        highlightedClass={highlightedCell === "prefix" ? "bg-gray-400" : null}
        onHighlight={() => onHighlight?.("prefix")}
        onUnhighlight={() => onHighlight?.(null)}
      />
    </div>
  );
}
