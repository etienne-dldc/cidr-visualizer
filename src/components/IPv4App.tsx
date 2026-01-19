import { DicesIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { useAppState } from "./AppStateProvider";
import { CopyButton } from "./CopyButton";
import { IPv4Bits } from "./IPv4Bits";
import { IPv4Input } from "./IPv4Input";

export function IPv4App() {
  const { ipv4, dispatch } = useAppState();

  return (
    <Fragment>
      <div className="flex flex-row items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-black/10" onClick={() => dispatch({ kind: "RandomIpv4" })}>
          <DicesIcon size={36} />
        </button>
        <IPv4Input ipv4={ipv4} onChange={(newIpv4) => dispatch({ kind: "SetIPv4", ipv4: newIpv4 })} />
        <CopyButton textToCopy={`${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}/${ipv4[4]}`} />
      </div>
      <IPv4Bits ipv4={ipv4} />
    </Fragment>
  );
}
