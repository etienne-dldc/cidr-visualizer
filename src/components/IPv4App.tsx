import { DicesIcon } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { getIPv4Mask } from "../utils/ipv4";
import { parseIPv4String } from "../utils/parseIPv4String";
import { checkIPv4Reserved } from "../utils/reservedIPv4";
import { useAppState } from "./AppStateProvider";
import { CopyButton } from "./CopyButton";
import { IPv4Bits } from "./IPv4Bits";
import { IPv4Input } from "./IPv4Input";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv4App() {
  const { ipv4, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);

  const ipv4Mask = getIPv4Mask(ipv4[4]);
  const maskString = `${ipv4Mask[0]}.${ipv4Mask[1]}.${ipv4Mask[2]}.${ipv4Mask[3]}`;
  const reservedInfo = checkIPv4Reserved(ipv4);

  const handleCidrClick = (cidr: string) => {
    const parsed = parseIPv4String(cidr);
    if (parsed) {
      dispatch({ kind: "SetIPv4", ipv4: parsed });
    }
  };

  return (
    <Fragment>
      <div className="flex flex-row items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-black/10" onClick={() => dispatch({ kind: "RandomIpv4" })}>
          <DicesIcon size={36} />
        </button>
        <CopyButton textToCopy={`${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}/${ipv4[4]}`} />
      </div>
      <div className="text-sm text-gray-600">Mask: {maskString}</div>
      <IPv4Input
        ipv4={ipv4}
        onChange={(newIpv4) => dispatch({ kind: "SetIPv4", ipv4: newIpv4 })}
        highlightedCell={highlightedCell}
        onHighlight={setHighlightedCell}
      />
      <IPv4Bits ipv4={ipv4} mask={ipv4Mask} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
