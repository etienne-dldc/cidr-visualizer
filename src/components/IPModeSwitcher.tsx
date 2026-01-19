import { useAppState } from "./AppStateProvider";
import { ButtonCard } from "./ButtonCard";

export function IPModeSwitcher() {
  const { mode, dispatch } = useAppState();

  return (
    <div className="flex gap-4 self-stretch rounded-xl bg-white p-4">
      <ButtonCard
        label="IPv4"
        description="32-bit addresses"
        isSelected={mode === "IPv4"}
        onClick={() => dispatch({ kind: "SetMode", mode: "IPv4" })}
      />
      <ButtonCard
        label="IPv6"
        description="128-bit addresses"
        isSelected={mode === "IPv6"}
        onClick={() => dispatch({ kind: "SetMode", mode: "IPv6" })}
      />
    </div>
  );
}
