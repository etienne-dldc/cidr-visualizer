import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { getIPv4Mask } from "../utils/ipv4/mask";
import { calculateIPv4NetworkInfo } from "../utils/ipv4/networkInfo";
import { parseIPv4String } from "../utils/ipv4/parse";
import { checkIPv4Reserved } from "../utils/ipv4/reserved";
import { generateIPv4ShareableURL } from "../utils/urlParams";
import { ActionButtonRow } from "./ActionButtonRow";
import { useAppState } from "./AppStateProvider";
import { IPv4Bits } from "./IPv4Bits";
import { IPv4Input } from "./IPv4Input";
import { NetworkInfoDisplay } from "./NetworkInfoDisplay";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv4App() {
  const { ipv4, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);

  const ipv4Mask = getIPv4Mask(ipv4[4]);
  const networkInfo = calculateIPv4NetworkInfo(ipv4);
  const reservedInfo = checkIPv4Reserved(ipv4);

  const ipv4String = `${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}`;
  const cidrString = `${ipv4String}/${ipv4[4]}`;
  const shareableURL = generateIPv4ShareableURL(ipv4);

  const handleCidrClick = (cidr: string) => {
    const parsed = parseIPv4String(cidr);
    if (parsed) {
      dispatch({ kind: "SetIPv4", ipv4: parsed });
    }
  };

  return (
    <Fragment>
      <ActionButtonRow
        onRandomNetwork={() => dispatch({ kind: "RandomPrefixIPv4" })}
        onRandomIP={() => dispatch({ kind: "RandomIPInNetworkIPv4" })}
        cidrString={cidrString}
        ipString={ipv4String}
        isRandomNetworkDisabled={ipv4[4] === 0}
        isRandomIPDisabled={ipv4[4] === 32}
        shareableURL={shareableURL}
        ipType="IPv4"
      />
      <div className="flex flex-col items-center">
        <IPv4Input highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      </div>
      <IPv4Bits ipv4={ipv4} mask={ipv4Mask} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <NetworkInfoDisplay info={networkInfo} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
