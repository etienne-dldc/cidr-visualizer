import type { IPv6CIDR } from "../utils/ipv4";
import { parseIPv6String } from "../utils/parseIPv6String";
import { DisplayInput, InputPart } from "./InputPart";

export interface IPv6InputProps {
  ipv6: IPv6CIDR;
  onChange: (ipv6: IPv6CIDR) => void;
}

export function IPv6Input({ ipv6, onChange }: IPv6InputProps) {
  const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = ipv6;

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const parsed = parseIPv6String(pastedText);
    if (parsed) {
      onChange(parsed);
      e.preventDefault();
      (document.activeElement as HTMLInputElement)?.blur();
    }
  };

  return (
    <div className="relative grid grid-flow-col-dense text-5xl" onPaste={handlePaste}>
      <InputPart
        value={p1}
        onChange={(value) => onChange([value, p2, p3, p4, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p2}
        onChange={(value) => onChange([p1, value, p3, p4, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p3}
        onChange={(value) => onChange([p1, p2, value, p4, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p4}
        onChange={(value) => onChange([p1, p2, p3, value, p5, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p5}
        onChange={(value) => onChange([p1, p2, p3, p4, value, p6, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p6}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, value, p7, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p7}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, p6, value, p8, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value=":" />
      <InputPart
        value={p8}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, p6, p7, value, prefixLength])}
        max={65535}
        shiftStep={256}
      />
      <DisplayInput value="/" />
      <InputPart
        value={prefixLength}
        onChange={(value) => onChange([p1, p2, p3, p4, p5, p6, p7, p8, value])}
        max={128}
        shiftStep={8}
        isHexadecimal={false}
      />
    </div>
  );
}
