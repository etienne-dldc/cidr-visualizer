import { track } from "@plausible-analytics/tracker";
import { produce } from "immer";
import { createContext, useContext, useMemo, useReducer, type ActionDispatch, type PropsWithChildren } from "react";
import { generateRandomIPv4CIDR, generateRandomIPv4InNetwork } from "../utils/ipv4/random";
import type { IPv4CIDR } from "../utils/ipv4/types";
import { generateRandomIPv6CIDR, generateRandomIPv6InNetwork } from "../utils/ipv6/random";
import type { IPv6CIDR } from "../utils/ipv6/types";
import { detectIPType } from "../utils/shared/detectIPType";
import { clearURLParams, readIPFromURL } from "../utils/urlParams";

export interface TAppState {
  mode: "IPv4" | "IPv6";
  ipv4: IPv4CIDR;
  ipv6: IPv6CIDR;
}

const AppStateContext = createContext<(TAppState & { dispatch: ActionDispatch<[action: TAppAction]> }) | null>(null);

export type TAppAction =
  | { kind: "SetMode"; mode: TAppState["mode"] }
  | { kind: "SetIPv4"; ipv4: IPv4CIDR }
  | { kind: "SetIPv6"; ipv6: IPv6CIDR }
  | { kind: "RandomPrefixIPv4" }
  | { kind: "RandomIPInNetworkIPv4" }
  | { kind: "RandomPrefixIPv6" }
  | { kind: "RandomIPInNetworkIPv6" };

function reducer(state: TAppState, action: TAppAction): TAppState {
  return produce(state, (draft) => {
    switch (action.kind) {
      case "SetMode":
        draft.mode = action.mode;
        return;
      case "SetIPv4":
        draft.ipv4 = action.ipv4;
        draft.mode = "IPv4";
        return;
      case "SetIPv6":
        draft.ipv6 = action.ipv6;
        draft.mode = "IPv6";
        return;
      case "RandomPrefixIPv4": {
        const prefixLength = draft.ipv4[4];
        draft.ipv4 = generateRandomIPv4CIDR(prefixLength);
        return;
      }
      case "RandomIPInNetworkIPv4": {
        draft.ipv4 = generateRandomIPv4InNetwork(draft.ipv4);
        return;
      }
      case "RandomPrefixIPv6": {
        const prefixLength = draft.ipv6[8];
        draft.ipv6 = generateRandomIPv6CIDR(prefixLength);
        return;
      }
      case "RandomIPInNetworkIPv6": {
        draft.ipv6 = generateRandomIPv6InNetwork(draft.ipv6);
        return;
      }
    }
    action satisfies never;
  });
}

export function AppStateProvider({ children }: PropsWithChildren) {
  // Try to parse IP from URL parameter
  const initialState = useMemo(() => {
    const ipParam = readIPFromURL();

    if (ipParam) {
      const detected = detectIPType(ipParam);

      // Clear the URL parameter immediately
      clearURLParams();

      // Prefer IPv4 if both parse (shouldn't happen in practice)
      if (detected.ipv4) {
        track("restore_from_url", { props: { ipType: "IPv4" } });
        return {
          mode: "IPv4" as const,
          ipv4: detected.ipv4,
          ipv6: [0, 0, 0, 0, 0, 0, 0, 0, 128] as IPv6CIDR,
        };
      }

      if (detected.ipv6) {
        track("restore_from_url", { props: { ipType: "IPv6" } });
        return {
          mode: "IPv6" as const,
          ipv4: [0, 0, 0, 0, 32] as IPv4CIDR,
          ipv6: detected.ipv6,
        };
      }
    }

    // Default state if no valid IP in URL
    return {
      mode: "IPv4" as const,
      ipv4: [0, 0, 0, 0, 32] as IPv4CIDR,
      ipv6: [0, 0, 0, 0, 0, 0, 0, 0, 128] as IPv6CIDR,
    };
  }, []);

  const [state, dispatch] = useReducer(reducer, initialState);

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
