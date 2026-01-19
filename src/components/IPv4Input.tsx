import type { IPv4CIDR } from "../utils/ipv4";
import { DisplayInput, InputPart } from "./InputPart";

export interface IPv4InputProps {
  ipv4: IPv4CIDR;
  onChange: (ipv4: IPv4CIDR) => void;
}

export function IPv4Input({ ipv4, onChange }: IPv4InputProps) {
  const [part1, part2, part3, part4, prefixLength] = ipv4;
  return (
    <div className="relative flex flex-row align-baseline text-5xl">
      <InputPart
        value={part1}
        onChange={(value) => onChange([value, part2, part3, part4, prefixLength])}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
      />
      <DisplayInput value="." />
      <InputPart
        value={part2}
        onChange={(value) => onChange([part1, value, part3, part4, prefixLength])}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
      />
      <DisplayInput value="." />
      <InputPart
        value={part3}
        onChange={(value) => onChange([part1, part2, value, part4, prefixLength])}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
      />
      <DisplayInput value="." />
      <InputPart
        value={part4}
        onChange={(value) => onChange([part1, part2, part3, value, prefixLength])}
        max={255}
        shiftStep={16}
        isHexadecimal={false}
      />
      <DisplayInput value="/" />
      <InputPart
        value={prefixLength}
        onChange={(value) => onChange([part1, part2, part3, part4, value])}
        max={32}
        shiftStep={4}
        isHexadecimal={false}
      />
    </div>
  );
}
