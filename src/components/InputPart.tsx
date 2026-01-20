import { useState } from "react";
import { incrementPart } from "../utils/shared/number";
import { parseDecimalPart } from "../utils/shared/parse";
import { parseHexPart } from "../utils/shared/parseHex";
import { cn } from "../utils/shared/styles";

const wrapper = cn("-mx-2 px-2 py-1");

export interface InputPartProps {
  onChange: (value: number) => void;
  value: number;
  max: number;
  shiftStep: number;
  isHexadecimal?: boolean;
  isHighlighted?: boolean;
  highlightedClass: string | null;
  onHighlight?: () => void;
  onUnhighlight?: () => void;
}

export function InputPart({
  onChange,
  value,
  max,
  shiftStep,
  isHexadecimal = true,
  isHighlighted,
  highlightedClass,
  onHighlight,
  onUnhighlight,
}: InputPartProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(isHexadecimal ? value?.toString(16) : value?.toString());

  const num = isHexadecimal ? parseHexPart(internalValue, max) : parseDecimalPart(internalValue, max);

  const isError = focused && internalValue && num === null;

  const onChangeInternal = (value: string) => {
    const parsed = isHexadecimal ? parseHexPart(value, max) : parseDecimalPart(value, max);
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
      const nextNum = incrementPart(currentNum, step, max);
      if (nextNum !== currentNum) {
        onChangeInternal(isHexadecimal ? nextNum.toString(16) : nextNum.toString());
        e.preventDefault();
      }
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeInternal(event.target.value);
  };

  const onFocus = () => {
    setInternalValue(isHexadecimal ? value.toString(16) : value.toString());
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
    setInternalValue(isHexadecimal ? value.toString(16) : value.toString());
  };

  const inputValue = focused ? internalValue : isHexadecimal ? value.toString(16) : value.toString();

  return (
    <div
      className={cn(
        "relative rounded-md",
        wrapper,
        isHighlighted && highlightedClass,
        isError && "after:absolute after:inset-0 after:rounded-md after:border-2 after:border-red-500",
      )}
      onMouseEnter={onHighlight}
      onMouseLeave={onUnhighlight}
    >
      <input
        type="text"
        placeholder="0"
        className="text-center font-mono leading-none outline-none"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ width: `${Math.max(1, inputValue.length)}ch` }}
      />
    </div>
  );
}

export function DisplayInput({ value }: { value: string }) {
  return (
    <div className={cn(wrapper, "pointer-events-none z-10")}>
      <input
        type="text"
        placeholder="0"
        disabled
        className="w-[1ch] text-center font-mono leading-none outline-none"
        value={value}
        readOnly
      />
    </div>
  );
}
