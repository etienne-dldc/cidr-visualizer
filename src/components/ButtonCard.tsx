import { cn } from "../utils/styles";

interface ButtonCardProps {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ButtonCard({
  label,
  description,
  isSelected,
  onClick,
}: ButtonCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `flex-1 p-8 py-4 rounded-lg transition-all cursor-pointer`,
        isSelected ? "bg-clay-soil" : "bg-parchment",
      )}
    >
      <h2 className={cn(`text-2xl font-bold`, isSelected ? "text-white" : "")}>
        {label}
      </h2>
      <p
        className={cn(
          `text-base font-medium`,
          isSelected ? "text-white/70" : "",
        )}
      >
        {description}
      </p>
    </button>
  );
}
