import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { formatIPv6, getIPv6Mask } from "../utils/ipv6/ipv6";
import { calculateIPv6NetworkInfo } from "../utils/ipv6/networkInfo";
import { parseIPv6String } from "../utils/ipv6/parse";
import { checkIPv6Reserved } from "../utils/ipv6/reserved";
import { generateIPv6ShareableURL } from "../utils/urlParams";
import { ActionButtonRow } from "./ActionButtonRow";
import { useAppState } from "./AppStateProvider";
import { IPv6Bits } from "./IPv6Bits";
import { IPv6Input } from "./IPv6Input";
import { NetworkInfoDisplay } from "./NetworkInfoDisplay";
import { ReservedIPInfo } from "./ReservedIPInfo";

export function IPv6App() {
  const { ipv6, dispatch } = useAppState();
  const [highlightedCell, setHighlightedCell] = useState<number | "prefix" | null>(null);

  const ipv6String = formatIPv6(ipv6);
  const ipv6WithPrefix = `${ipv6String}/${ipv6[8]}`;
  const shareableURL = generateIPv6ShareableURL(ipv6);

  const ipv6Mask = getIPv6Mask(ipv6[8]);
  const networkInfo = calculateIPv6NetworkInfo(ipv6);

  const reservedInfo = checkIPv6Reserved(ipv6);

  const handleCidrClick = (cidr: string) => {
    const parsed = parseIPv6String(cidr);
    if (parsed) {
      dispatch({ kind: "SetIPv6", ipv6: parsed });
    }
  };

  return (
    <Fragment>
      <ActionButtonRow
        onRandomNetwork={() => dispatch({ kind: "RandomPrefixIPv6" })}
        onRandomIP={() => dispatch({ kind: "RandomIPInNetworkIPv6" })}
        cidrString={ipv6WithPrefix}
        ipString={ipv6String}
        isRandomNetworkDisabled={ipv6[8] === 0}
        isRandomIPDisabled={ipv6[8] === 128}
        shareableURL={shareableURL}
      />
      <div className="flex flex-col items-center">
        <IPv6Input highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      </div>
      <IPv6Bits ipv6={ipv6} mask={ipv6Mask} highlightedCell={highlightedCell} onHighlight={setHighlightedCell} />
      <NetworkInfoDisplay info={networkInfo} />
      <ReservedIPInfo info={reservedInfo} onCidrClick={handleCidrClick} />
    </Fragment>
  );
}
