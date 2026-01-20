import { ClipboardIcon, Dice1Icon, DicesIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { getIPv4Mask } from "../utils/ipv4";
import { calculateIPv4NetworkInfo } from "../utils/networkInfo";
import { parseIPv4String } from "../utils/parseIPv4String";
import { checkIPv4Reserved } from "../utils/reservedIPv4";
import { ActionButton } from "./ActionButton";
import { useAppState } from "./AppStateProvider";
import { IPv4Bits } from "./IPv4Bits";
import { IPv4Input } from "./IPv4Input";
import { NetworkInfoDisplay } from "./NetworkInfoDisplay";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv4App() {
  const { ipv4, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);
  const [copiedState, setCopiedState] = useState<"cidr" | "ip" | null>(null);

  const ipv4Mask = getIPv4Mask(ipv4[4]);
  const networkInfo = calculateIPv4NetworkInfo(ipv4);
  const reservedInfo = checkIPv4Reserved(ipv4);

  const ipv4String = `${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}`;
  const cidrString = `${ipv4String}/${ipv4[4]}`;

  const handleCidrClick = (cidr: string) => {
    const parsed = parseIPv4String(cidr);
    if (parsed) {
      dispatch({ kind: "SetIPv4", ipv4: parsed });
    }
  };

  const handleCopyCidr = () => {
    navigator.clipboard.writeText(cidrString).catch(() => {});
    setCopiedState("cidr");
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleCopyIP = () => {
    navigator.clipboard.writeText(ipv4String).catch(() => {});
    setCopiedState("ip");
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <Fragment>
      <div className="grid grid-cols-4 gap-2">
        <ActionButton icon={DicesIcon} label="Random Prefix" onClick={() => dispatch({ kind: "RandomPrefixIPv4" })} />
        <ActionButton
          icon={Dice1Icon}
          label="Random IP"
          onClick={() => dispatch({ kind: "RandomIPInNetworkIPv4" })}
          disabled={ipv4[4] === 32}
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
        <IPv4Input
          ipv4={ipv4}
          onChange={(newIpv4) => dispatch({ kind: "SetIPv4", ipv4: newIpv4 })}
          highlightedCell={highlightedCell}
          onHighlight={setHighlightedCell}
          onModeSwitch={(mode, ipData) => {
            dispatch({ kind: "SetMode", mode });
            if (mode === "IPv6") {
              dispatch({ kind: "SetIPv6", ipv6: ipData as any });
            }
          }}
        />
      </div>
      <IPv4Bits ipv4={ipv4} mask={ipv4Mask} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <NetworkInfoDisplay info={networkInfo} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
