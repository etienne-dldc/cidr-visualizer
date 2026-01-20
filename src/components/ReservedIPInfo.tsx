import { InfoIcon } from "lucide-react";
import type { ReservedIPInfo as ReservedIPInfoType } from "../utils/reservedIPs";

export interface ReservedIPInfoProps {
  info: ReservedIPInfoType | null;
}

export function ReservedIPInfo({ info }: ReservedIPInfoProps) {
  if (!info) {
    return null;
  }

  return (
    <div className="mt-6 rounded-lg border border-blue-300 bg-blue-50 p-4">
      <div className="flex items-start gap-3">
        <InfoIcon className="mt-0.5 shrink-0 text-blue-600" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900">{info.name}</h3>
          <p className="mt-1 text-sm text-blue-800">{info.description}</p>
          {info.rfc && <p className="mt-1 text-xs text-blue-600">{info.rfc}</p>}
        </div>
      </div>
    </div>
  );
}
