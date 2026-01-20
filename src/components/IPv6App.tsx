import { ClipboardIcon, Dice1Icon, DicesIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { formatIPv6, getIPv6Mask } from "../utils/ipv6";
import { calculateIPv6NetworkInfo } from "../utils/networkInfo";
import { parseIPv6String } from "../utils/parseIPv6String";
import { checkIPv6Reserved } from "../utils/reservedIPv6";
import { ActionButton } from "./ActionButton";
import { useAppState } from "./AppStateProvider";
import { IPv6Bits } from "./IPv6Bits";
import { IPv6Input } from "./IPv6Input";
import { NetworkInfoDisplay } from "./NetworkInfoDisplay";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv6App() {
  const { ipv6, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);
  const [copiedState, setCopiedState] = useState<"cidr" | "ip" | null>(null);

  const ipv6String = formatIPv6(ipv6);
  const ipv6WithPrefix = `${ipv6String}/${ipv6[8]}`;

  const ipv6Mask = getIPv6Mask(ipv6[8]);
  const networkInfo = calculateIPv6NetworkInfo(ipv6);

  const reservedInfo = checkIPv6Reserved(ipv6);

  const handleCidrClick = (cidr: string) => {
    const parsed = parseIPv6String(cidr);
    if (parsed) {
      dispatch({ kind: "SetIPv6", ipv6: parsed });
    }
  };

  const handleCopyCidr = () => {
    navigator.clipboard.writeText(ipv6WithPrefix).catch(() => {});
    setCopiedState("cidr");
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleCopyIP = () => {
    navigator.clipboard.writeText(ipv6String).catch(() => {});
    setCopiedState("ip");
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <Fragment>
      <div className="grid grid-cols-4 gap-2">
        <ActionButton icon={DicesIcon} label="Random Prefix" onClick={() => dispatch({ kind: "RandomPrefixIPv6" })} />
        <ActionButton
          icon={Dice1Icon}
          label="Random IP"
          onClick={() => dispatch({ kind: "RandomIPInNetworkIPv6" })}
          disabled={ipv6[8] === 128}
        />
        <ActionButton
          icon={ClipboardIcon}
          label="Copy CIDR"
          onClick={handleCopyCidr}
          isCopied={copiedState === "cidr"}
        />
        <ActionButton icon={ClipboardIcon} label="Copy IP" onClick={handleCopyIP} isCopied={copiedState === "ip"} />
      </div>
      <div className="flex flex-col items-center">
        <IPv6Input
          ipv6={ipv6}
          onChange={(newIpv6) => dispatch({ kind: "SetIPv6", ipv6: newIpv6 })}
          highlightedCell={highlightedCell}
          onHighlight={setHighlightedCell}
          onModeSwitch={(mode, ipData) => {
            dispatch({ kind: "SetMode", mode });
            if (mode === "IPv4") {
              dispatch({ kind: "SetIPv4", ipv4: ipData as any });
            }
          }}
        />
      </div>
      <IPv6Bits ipv6={ipv6} mask={ipv6Mask} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <NetworkInfoDisplay info={networkInfo} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
