import { DicesIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { formatIPv6 } from "../utils/ipv6";
import { useAppState } from "./AppStateProvider";
import { CopyButton } from "./CopyButton";
import { IPv6Bits } from "./IPv6Bits";
import { IPv6Input } from "./IPv6Input";

export function IPv6App() {
  const { ipv6, dispatch } = useAppState();

  const ipv6String = formatIPv6(ipv6);
  const ipv6WithPrefix = `${ipv6String}/${ipv6[8]}`;

  return (
    <Fragment>
      <div className="flex flex-row items-center gap-4">
        <button
          className="rounded-lg hover:bg-black/10 p-2"
          onClick={() => dispatch({ kind: "RandomIpv6" })}
        >
          <DicesIcon size={36} />
        </button>
        <IPv6Input
          ipv6={ipv6}
          onChange={(newIpv6) => dispatch({ kind: "SetIPv6", ipv6: newIpv6 })}
        />
        <CopyButton textToCopy={ipv6WithPrefix} />
      </div>
      <IPv6Bits ipv6={ipv6} />
    </Fragment>
  );
}
