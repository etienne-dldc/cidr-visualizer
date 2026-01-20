import { InfoIcon } from "lucide-react";
import type { ReservedIPMatch } from "../utils/reservedIPs";

export interface ReservedIPInfoProps {
  info: ReservedIPMatch | null;
}

export function ReservedIPInfo({ info }: ReservedIPInfoProps) {
  if (!info) {
    return null;
  }

  return (
    <div className="mt-6 rounded-lg bg-periwinkle p-5">
      <div className="flex items-start gap-3">
        <InfoIcon className="mt-0.5 shrink-0 text-carbon-black" size={24} />
        <div className="flex-1">
          <p className="text-base text-carbon-black">
            <span className="font-semibold">{info.cidr}</span> is a reserved IP range{" "}
            {info.description.toLowerCase().startsWith("used for") ||
            info.description.toLowerCase().startsWith("reserved for")
              ? info.description.charAt(0).toLowerCase() + info.description.slice(1)
              : `used for ${info.description.toLowerCase()}`}
            .
          </p>
          {info.rfc && <p className="mt-2 text-sm text-dim-grey">{info.rfc}</p>}
        </div>
      </div>
    </div>
  );
}
