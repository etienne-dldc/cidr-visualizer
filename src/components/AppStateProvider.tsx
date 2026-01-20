import { produce } from "immer";
import { createContext, useContext, useMemo, useReducer, type ActionDispatch, type PropsWithChildren } from "react";
import type { IPv4CIDR, IPv6CIDR } from "../utils/ipv4";

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
        // Prefix represents HOST bits - randomize only those bits
        const [p1, p2, p3, p4, prefixLength] = draft.ipv4;
        // Convert to string of bits
        let bits = (
          p1.toString(2).padStart(8, "0") +
          p2.toString(2).padStart(8, "0") +
          p3.toString(2).padStart(8, "0") +
          p4.toString(2).padStart(8, "0")
        ).split("");
        bits.forEach((_, index) => {
          if (index < 32 - prefixLength) {
            // Randomize network bits (before the host bits)
            bits[index] = Math.random() < 0.5 ? "0" : "1";
          }
        });
        // Convert back to numbers
        const newP1 = parseInt(bits.slice(0, 8).join(""), 2);
        const newP2 = parseInt(bits.slice(8, 16).join(""), 2);
        const newP3 = parseInt(bits.slice(16, 24).join(""), 2);
        const newP4 = parseInt(bits.slice(24, 32).join(""), 2);
        draft.ipv4 = [newP1, newP2, newP3, newP4, prefixLength];
        return;
      }
      case "SetIPv6":
        draft.ipv6 = action.ipv6;
        return;
      case "RandomIpv6": {
        // Prefix represents HOST bits - randomize only those bits
        const [p1, p2, p3, p4, p5, p6, p7, p8, prefixLength] = draft.ipv6;
        // Convert to string of bits
        let bits = (
          p1.toString(2).padStart(16, "0") +
          p2.toString(2).padStart(16, "0") +
          p3.toString(2).padStart(16, "0") +
          p4.toString(2).padStart(16, "0") +
          p5.toString(2).padStart(16, "0") +
          p6.toString(2).padStart(16, "0") +
          p7.toString(2).padStart(16, "0") +
          p8.toString(2).padStart(16, "0")
        ).split("");
        bits.forEach((_, index) => {
          if (index < 128 - prefixLength) {
            // Randomize network bits (before the host bits)
            bits[index] = Math.random() < 0.5 ? "0" : "1";
          }
        });
        // Convert back to numbers
        const newP1 = parseInt(bits.slice(0, 16).join(""), 2);
        const newP2 = parseInt(bits.slice(16, 32).join(""), 2);
        const newP3 = parseInt(bits.slice(32, 48).join(""), 2);
        const newP4 = parseInt(bits.slice(48, 64).join(""), 2);
        const newP5 = parseInt(bits.slice(64, 80).join(""), 2);
        const newP6 = parseInt(bits.slice(80, 96).join(""), 2);
        const newP7 = parseInt(bits.slice(96, 112).join(""), 2);
        const newP8 = parseInt(bits.slice(112, 128).join(""), 2);
        draft.ipv6 = [newP1, newP2, newP3, newP4, newP5, newP6, newP7, newP8, prefixLength];
        return;
      }
    }
    action satisfies never;
  });
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, {
    mode: "IPv4",
    ipv4: [0, 0, 0, 0, 0],
    ipv6: [0, 0, 0, 0, 0, 0, 0, 0, 0],
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
