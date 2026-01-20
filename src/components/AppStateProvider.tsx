import { produce } from "immer";
import { createContext, useContext, useMemo, useReducer, type ActionDispatch, type PropsWithChildren } from "react";
import type { IPv4CIDR, IPv6CIDR } from "../utils/ipv4";
import { generateRandomIPv4CIDR } from "../utils/ipv4";
import { generateRandomIPv6CIDR } from "../utils/ipv6";

export interface TAppState {
  mode: "IPv4" | "IPv6";
  ipv4: IPv4CIDR;
  ipv6: IPv6CIDR;
}

const AppStateContext = createContext<(TAppState & { dispatch: ActionDispatch<[action: TAppAction]> }) | null>(null);

export type TAppAction =
  | { kind: "SetMode"; mode: TAppState["mode"] }
  | { kind: "SetIPv4"; ipv4: IPv4CIDR }
  | { kind: "RandomIpv4" }
  | { kind: "SetIPv6"; ipv6: IPv6CIDR }
  | { kind: "RandomIpv6" };

function reducer(state: TAppState, action: TAppAction): TAppState {
  return produce(state, (draft) => {
    switch (action.kind) {
      case "SetMode":
        draft.mode = action.mode;
        return;
      case "SetIPv4":
        draft.ipv4 = action.ipv4;
        return;
      case "RandomIpv4": {
        const prefixLength = draft.ipv4[4];
        draft.ipv4 = generateRandomIPv4CIDR(prefixLength);
        return;
      }
      case "SetIPv6":
        draft.ipv6 = action.ipv6;
        return;
      case "RandomIpv6": {
        const prefixLength = draft.ipv6[8];
        draft.ipv6 = generateRandomIPv6CIDR(prefixLength);
        return;
      }
    }
    action satisfies never;
  });
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {
    mode: "IPv4",
    ipv4: [0, 0, 0, 0, 32],
    ipv6: [0, 0, 0, 0, 0, 0, 0, 0, 128],
  });

  const contextValue = useMemo(() => ({ ...state, dispatch }), [state, dispatch]);

  return <AppStateContext value={contextValue}>{children}</AppStateContext>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
