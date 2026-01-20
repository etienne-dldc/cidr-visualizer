import type { LucideIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isCopied?: boolean;
  disabled?: boolean;
}

export function ActionButton({ icon: Icon, label, onClick, isCopied = false, disabled = false }: ActionButtonProps) {
  return (
    <button
      className="flex flex-col items-center gap-1 rounded-lg p-3 hover:bg-black/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      onClick={onClick}
      title={label}
      disabled={disabled}
    >
      {isCopied ? <CheckIcon size={32} /> : <Icon size={32} />}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
