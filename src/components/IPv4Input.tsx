import { useState } from "react";
import type { IPv4CIDR } from "../utils/ipv4";
import { cn } from "../utils/styles";

const wrapper = cn("px-2 -mx-2 py-1");

export interface IPv4InputProps {
  ipv4: IPv4CIDR;
  onChange: (ipv4: IPv4CIDR) => void;
}

export function IPv4Input({ ipv4, onChange }: IPv4InputProps) {
  const [part1, part2, part3, part4, prefixLength] = ipv4;
  return (
    <div className="flex flex-row align-baseline text-5xl relative">
      <InputPart
        value={part1}
        onChange={(value) =>
          onChange([value, part2, part3, part4, prefixLength])
        }
        max={255}
        shiftStep={16}
      />
      <DisplayInput value="." />
      <InputPart
        value={part2}
        onChange={(value) =>
          onChange([part1, value, part3, part4, prefixLength])
        }
        max={255}
        shiftStep={16}
      />
      <DisplayInput value="." />
      <InputPart
        value={part3}
        onChange={(value) =>
          onChange([part1, part2, value, part4, prefixLength])
        }
        max={255}
        shiftStep={16}
      />
      <DisplayInput value="." />
      <InputPart
        value={part4}
        onChange={(value) =>
          onChange([part1, part2, part3, value, prefixLength])
        }
        max={255}
        shiftStep={16}
      />
      <DisplayInput value="/" />
      <InputPart
        value={prefixLength}
        onChange={(value) => onChange([part1, part2, part3, part4, value])}
        max={32}
        shiftStep={4}
      />
    </div>
  );
}

interface InputPartProps {
  onChange: (value: number) => void;
  value: number;
  max: number;
  shiftStep: number;
}

function InputPart({ onChange, value, max, shiftStep }: InputPartProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value?.toString());

  const maxLength = Math.floor(Math.log10(max)) + 1;

  const num = parseIpv4Part(internalValue, max);

  const isError = focused && internalValue && num === null;

  const onChangeInternal = (value: string) => {
    const parsed = parseIpv4Part(value, max);
    if (parsed !== null) {
      onChange(parsed);
    }
    setInternalValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentNum = num ?? 0;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      let step = e.shiftKey ? shiftStep : 1;
      step = e.key === "ArrowUp" ? step : -step;
      const nextNum = incrementIpv4Part(currentNum, step, max);
      if (nextNum !== currentNum) {
        onChangeInternal(nextNum.toString());
        e.preventDefault();
      }
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeInternal(event.target.value);
  };

  const onFocus = () => {
    setInternalValue(value.toString());
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
    setInternalValue(value.toString());
  };

  const inputValue = focused ? internalValue : value.toString();

  return (
    <div
      className={cn(
        "hover:bg-white rounded-md relative",
        wrapper,
        focused && "bg-white",
        isError &&
          "after:inset-0 after:border-2 after:border-red-500 after:absolute after:rounded-md",
      )}
    >
      <input
        type="text"
        placeholder="0"
        className="text-center font-mono outline-none leading-none"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ width: `${Math.max(maxLength, inputValue.length)}ch` }}
      />
    </div>
  );
}

function DisplayInput({ value }: { value: string }) {
  return (
    <div className={cn(wrapper, "z-10")}>
      <input
        type="text"
        placeholder="0"
        disabled
        className="text-center font-mono w-[1ch] outline-none leading-none"
        value={value}
        readOnly
      />
    </div>
  );
}

function parseIpv4Part(part: string, max: number): number | null {
  if (!part) {
    return 0;
  }
  const num = parseInt(part, 10);
  if (isNaN(num)) {
    return null;
  }
  return clamp(num, 0, max);
}

function incrementIpv4Part(part: number, step: number, max: number): number {
  if (Math.abs(step) === 1) {
    return clamp(part + step, 0, max);
  }
  if (part % step === 0) {
    // Already aligned, just add step
    return clamp(part + step, 0, max);
  }
  // Not aligned, snap to next multiple of step
  const next =
    step > 0 ? Math.ceil(part / step) * step : Math.floor(part / step) * step;
  return clamp(next, 0, max);
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
