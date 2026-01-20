import { InfoIcon } from "lucide-react";
import type { ReservedIPMatch } from "../utils/reservedIPv4";

export interface ReservedIPInfoProps {
  info: ReservedIPMatch | null;
}

export function ReservedIPInfo({ info }: ReservedIPInfoProps) {
  if (!info) {
    return null;
  }

  // Format the description to create a natural sentence
  const lowerDesc = info.description.toLowerCase();
  const descriptionText =
    lowerDesc.startsWith("used for") || lowerDesc.startsWith("reserved for")
      ? lowerDesc
      : `used for ${lowerDesc}`;

  return (
    <div className="mt-6 rounded-lg bg-periwinkle p-5">
      <div className="flex items-start gap-3">
        <InfoIcon className="mt-0.5 shrink-0 text-carbon-black" size={24} />
        <div className="flex-1">
          <p className="text-base text-carbon-black">
            <span className="font-semibold">{info.cidr}</span> is a reserved IP range {descriptionText}.
          </p>
          {info.rfc && <p className="mt-2 text-sm text-dim-grey">{info.rfc}</p>}
        </div>
      </div>
    </div>
  );
}
