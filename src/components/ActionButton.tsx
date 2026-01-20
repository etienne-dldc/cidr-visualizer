import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react";
import type { LucideIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isCopied?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

export function ActionButton({
  icon: Icon,
  label,
  onClick,
  isCopied = false,
  disabled = false,
  tooltip,
}: ActionButtonProps) {
  const tooltipStore = useTooltipStore();

  return (
    <>
      <TooltipAnchor
        store={tooltipStore}
        render={
          <button
            className="flex flex-col items-center gap-1 rounded-lg p-3 hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            onClick={onClick}
            disabled={disabled}
          />
        }
      >
        {isCopied ? <CheckIcon size={32} /> : <Icon size={32} />}
        <span className="text-xs font-medium">{label}</span>
      </TooltipAnchor>
      {tooltip && !disabled && (
        <Tooltip
          store={tooltipStore}
          className="z-50 max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  );
}
