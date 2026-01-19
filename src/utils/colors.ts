const HIGHLIGHT_COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-amber-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
];

export function getHighlightColor(index: number | null): string {
  if (index === null || index < 0 || index >= HIGHLIGHT_COLORS.length) {
    return "";
  }
  return HIGHLIGHT_COLORS[index];
}
