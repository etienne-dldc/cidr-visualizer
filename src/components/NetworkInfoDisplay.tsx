import type { LucideIcon } from "lucide-react";
import { ArrowRightFromLine, ArrowRightToLine, GlobeIcon, LayersIcon, Share2Icon, ShieldIcon } from "lucide-react";
import type { IPv4NetworkInfo } from "../utils/ipv4/networkInfo";
import { formatCount, formatIPv4 } from "../utils/ipv4/networkInfo";
import { formatIPv6 } from "../utils/ipv6/ipv6";
import type { IPv6NetworkInfo } from "../utils/ipv6/networkInfo";

interface NetworkInfoDisplayProps {
  info: IPv4NetworkInfo | IPv6NetworkInfo;
}

export function NetworkInfoDisplay({ info }: NetworkInfoDisplayProps) {
  const netmaskStr = info.mode === "IPv4" ? formatIPv4(info.netmask) : formatIPv6(info.netmask);

  const baseIPStr = info.mode === "IPv4" ? formatIPv4(info.baseIP) : formatIPv6(info.baseIP);
  const broadcastIPStr =
    info.broadcastIP === null
      ? "-"
      : info.mode === "IPv4"
        ? formatIPv4(info.broadcastIP)
        : formatIPv6(info.broadcastIP);

  const firstUsableStr =
    info.firstUsableIP === null
      ? "-"
      : info.mode === "IPv4"
        ? formatIPv4(info.firstUsableIP)
        : formatIPv6(info.firstUsableIP);

  const lastUsableStr =
    info.lastUsableIP === null
      ? "-"
      : info.mode === "IPv4"
        ? formatIPv4(info.lastUsableIP)
        : formatIPv6(info.lastUsableIP);

  const countStr = formatCount(info.count);

  return (
    <div className="bg-almond-silk rounded-lg p-5">
      <div className={`grid ${info.mode === "IPv4" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-6`}>
        <NetworkProperty icon={ShieldIcon} label="Netmask" value={netmaskStr} />
        <NetworkProperty icon={GlobeIcon} label="CIDR Base IP" value={baseIPStr} />
        <NetworkProperty icon={Share2Icon} label="Broadcast IP" value={broadcastIPStr} />
        <NetworkProperty icon={LayersIcon} label="Count" value={countStr} />
        <NetworkProperty icon={ArrowRightFromLine} label="First Usable IP" value={firstUsableStr} />
        <NetworkProperty icon={ArrowRightToLine} label="Last Usable IP" value={lastUsableStr} />
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
    <div className="flex items-center gap-5">
      <Icon className="text-carbon-black mt-1 shrink-0" size={28} />
      <div className="min-w-0 flex-1">
        <p className="text-dim-grey text-xs font-medium">{label}</p>
        <p className="text-carbon-black font-mono text-lg font-semibold break-all">{value}</p>
      </div>
    </div>
  );
}
