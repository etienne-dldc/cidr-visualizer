import { DicesIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import type { IPv4CIDR } from "../utils/ipv4";
import { checkIPv4Reserved } from "../utils/reservedIPv4";
import { useAppState } from "./AppStateProvider";
import { CopyButton } from "./CopyButton";
import { IPv4Bits } from "./IPv4Bits";
import { IPv4Input } from "./IPv4Input";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv4App() {
  const { ipv4, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);

  const reservedInfo = checkIPv4Reserved(ipv4);

  const handleCidrClick = (cidr: string) => {
    const [address, prefix] = cidr.split("/");
    const parts = address.split(".").map((p) => parseInt(p, 10));
    const prefixLength = parseInt(prefix, 10);
    
    const newIpv4: IPv4CIDR = [parts[0], parts[1], parts[2], parts[3], prefixLength];
    dispatch({ kind: "SetIPv4", ipv4: newIpv4 });
  };

  return (
    <Fragment>
      <div className="flex flex-row items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-black/10" onClick={() => dispatch({ kind: "RandomIpv4" })}>
          <DicesIcon size={36} />
        </button>
        <CopyButton textToCopy={`${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}/${ipv4[4]}`} />
      </div>
      <IPv4Input
        ipv4={ipv4}
        onChange={(newIpv4) => dispatch({ kind: "SetIPv4", ipv4: newIpv4 })}
        highlightedCell={highlightedCell}
        onHighlight={setHighlightedCell}
      />
      <IPv4Bits ipv4={ipv4} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
