import { InfoIcon } from "lucide-react";
import type { ReservedIPMatch } from "../utils/reservedIPTypes";

export interface ReservedIPInfoProps {
  info: ReservedIPMatch | null;
  onCidrClick?: (cidr: string) => void;
}

export function ReservedIPInfo({ info, onCidrClick }: ReservedIPInfoProps) {
  if (!info) {
    return null;
  }

  // Format the description to create a natural sentence
  const lowerDesc = info.description.toLowerCase();
  const descriptionText =
    lowerDesc.startsWith("used for") || lowerDesc.startsWith("reserved for") ? lowerDesc : `used for ${lowerDesc}`;

  return (
    <div className="bg-lime-moss rounded-lg p-5">
      <div className="flex items-start gap-3">
        <InfoIcon className="text-carbon-black shrink-0" size={24} />
        <div className="flex-1">
          <p className="text-carbon-black text-base">
            <button
              className="cursor-pointer font-semibold underline decoration-dotted hover:decoration-solid"
              onClick={() => onCidrClick?.(info.cidr)}
              type="button"
            >
              {info.cidr}
            </button>{" "}
            is a reserved IP range {descriptionText}.
          </p>
          {info.rfc && <p className="text-carbon-black/60 mt-2 text-sm">{info.rfc}</p>}
        </div>
      </div>
    </div>
  );
}
