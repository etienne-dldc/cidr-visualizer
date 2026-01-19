import { useState } from "react";
import { incrementPart } from "../utils/number";
import { parseDecimalPart } from "../utils/parse";
import { parseHexPart } from "../utils/parseHex";
import { cn } from "../utils/styles";

const wrapper = cn("px-2 -mx-2 py-1");

export interface InputPartProps {
  onChange: (value: number) => void;
  value: number;
  max: number;
  shiftStep: number;
  isHexadecimal?: boolean;
}

export function InputPart({
  onChange,
  value,
  max,
  shiftStep,
  isHexadecimal = true,
}: InputPartProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(
    isHexadecimal ? value?.toString(16) : value?.toString(),
  );

  const num = isHexadecimal
    ? parseHexPart(internalValue, max)
    : parseDecimalPart(internalValue, max);

  const isError = focused && internalValue && num === null;

  const onChangeInternal = (value: string) => {
    const parsed = isHexadecimal
      ? parseHexPart(value, max)
      : parseDecimalPart(value, max);
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
        onChangeInternal(
          isHexadecimal ? nextNum.toString(16) : nextNum.toString(),
        );
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

  const inputValue = focused
    ? internalValue
    : isHexadecimal
      ? value.toString(16)
      : value.toString();

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
        style={{ width: `${Math.max(1, inputValue.length)}ch` }}
      />
    </div>
  );
}

export function DisplayInput({ value }: { value: string }) {
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
