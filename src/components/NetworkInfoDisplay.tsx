import type { LucideIcon } from "lucide-react";
import { ArrowDownIcon, ArrowUpIcon, GlobeIcon, LayersIcon, Share2Icon, ShieldIcon } from "lucide-react";
import type { IPv4, IPv6 } from "../utils/ipv4";
import { formatIPv6 } from "../utils/ipv6";
import type { IPv4NetworkInfo, IPv6NetworkInfo } from "../utils/networkInfo";
import { formatCount, formatIPv4 } from "../utils/networkInfo";

interface NetworkInfoDisplayProps {
  isIPv4: boolean;
  info: IPv4NetworkInfo | IPv6NetworkInfo;
}

export function NetworkInfoDisplay({ isIPv4, info }: NetworkInfoDisplayProps) {
  const netmaskStr = isIPv4
    ? formatIPv4(info.netmask as unknown as IPv4)
    : formatIPv6(info.netmask as unknown as IPv6 as any);

  const baseIPStr = isIPv4
    ? formatIPv4(info.baseIP as unknown as IPv4)
    : formatIPv6(info.baseIP as unknown as IPv6 as any);

  const broadcastIPStr = isIPv4
    ? formatIPv4(info.broadcastIP as unknown as IPv4)
    : formatIPv6(info.broadcastIP as unknown as IPv6 as any);

  const firstUsableStr =
    info.firstUsableIP && isIPv4
      ? formatIPv4(info.firstUsableIP as unknown as IPv4)
      : info.firstUsableIP
        ? formatIPv6(info.firstUsableIP as unknown as IPv6 as any)
        : "—";

  const lastUsableStr =
    info.lastUsableIP && isIPv4
      ? formatIPv4(info.lastUsableIP as unknown as IPv4)
      : info.lastUsableIP
        ? formatIPv6(info.lastUsableIP as unknown as IPv6 as any)
        : "—";

  const countStr = formatCount(info.count);

  return (
    <div className="bg-almond-silk mt-6 rounded-lg p-5">
      <div className={`grid ${isIPv4 ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
        <NetworkProperty icon={ShieldIcon} label="Netmask" value={netmaskStr} />
        <NetworkProperty icon={GlobeIcon} label="CIDR Base IP" value={baseIPStr} />
        <NetworkProperty icon={Share2Icon} label="Broadcast IP" value={broadcastIPStr} />
        <NetworkProperty icon={LayersIcon} label="Count" value={countStr} />
        <NetworkProperty icon={ArrowUpIcon} label="First Usable IP" value={firstUsableStr} />
        <NetworkProperty icon={ArrowDownIcon} label="Last Usable IP" value={lastUsableStr} />
      </div>
    </div>
  );
}

interface NetworkPropertyProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function NetworkProperty({ icon: Icon, label, value }: NetworkPropertyProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="text-carbon-black mt-1 shrink-0" size={28} />
      <div className="min-w-0 flex-1">
        <p className="text-dim-grey text-xs font-medium">{label}</p>
        <p className="text-carbon-black font-mono text-lg font-semibold break-all">{value}</p>
      </div>
    </div>
  );
}
