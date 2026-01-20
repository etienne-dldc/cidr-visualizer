import { DicesIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { formatIPv6 } from "../utils/ipv6";
import type { IPv6CIDR } from "../utils/ipv4";
import { checkIPv6Reserved } from "../utils/reservedIPv6";
import { useAppState } from "./AppStateProvider";
import { CopyButton } from "./CopyButton";
import { IPv6Bits } from "./IPv6Bits";
import { IPv6Input } from "./IPv6Input";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv6App() {
  const { ipv6, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);

  const ipv6String = formatIPv6(ipv6);
  const ipv6WithPrefix = `${ipv6String}/${ipv6[8]}`;

  const reservedInfo = checkIPv6Reserved(ipv6);

  const handleCidrClick = (cidr: string) => {
    const [address, prefix] = cidr.split("/");
    const prefixLength = parseInt(prefix, 10);
    
    // Expand IPv6 address if it has :: notation
    const expandIPv6 = (addr: string): string => {
      if (addr.includes("::")) {
        const [before, after] = addr.split("::");
        const beforeParts = before ? before.split(":").filter((p) => p !== "") : [];
        const afterParts = after ? after.split(":").filter((p) => p !== "") : [];
        const missingParts = 8 - beforeParts.length - afterParts.length;
        const middle = Array(missingParts).fill("0");
        const allParts = [...beforeParts, ...middle, ...afterParts];
        return allParts.join(":");
      }
      return addr;
    };
    
    const expandedAddress = expandIPv6(address);
    const parts = expandedAddress.split(":").map((p) => parseInt(p || "0", 16));
    
    const newIpv6: IPv6CIDR = [parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], prefixLength];
    dispatch({ kind: "SetIPv6", ipv6: newIpv6 });
  };

  return (
    <Fragment>
      <div className="flex flex-row items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-black/10" onClick={() => dispatch({ kind: "RandomIpv6" })}>
          <DicesIcon size={36} />
        </button>
        <CopyButton textToCopy={ipv6WithPrefix} />
      </div>
      <IPv6Input
        ipv6={ipv6}
        onChange={(newIpv6) => dispatch({ kind: "SetIPv6", ipv6: newIpv6 })}
        highlightedCell={highlightedCell}
        onHighlight={setHighlightedCell}
      />
      <IPv6Bits ipv6={ipv6} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
