import { produce } from "immer";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ActionDispatch,
  type PropsWithChildren,
} from "react";
import type { IPv4CIDR } from "../utils/ipv4";

export interface TAppState {
  mode: "IPv4" | "IPv6";
  ipv4: IPv4CIDR;
}

const AppStateContext = createContext<
  (TAppState & { dispatch: ActionDispatch<[action: TAppAction]> }) | null
>(null);

export type TAppAction =
  | { kind: "SetMode"; mode: TAppState["mode"] }
  | { kind: "SetIPv4"; ipv4: IPv4CIDR }
  | { kind: "RandomIpv4" };

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
        // Randomize bits but not covered by the prefix
        const [p1, p2, p3, p4, prefixLength] = draft.ipv4;
        // Convert to string of bits
        let bits = (
          p1.toString(2).padStart(8, "0") +
          p2.toString(2).padStart(8, "0") +
          p3.toString(2).padStart(8, "0") +
          p4.toString(2).padStart(8, "0")
        ).split("");
        bits.forEach((_, index) => {
          if (index < bits.length - prefixLength) {
            bits[index] = Math.random() < 0.5 ? "0" : "1";
          } else {
            bits[index] = "0";
          }
        });
        // const randomizedBits = bits
        // Convert back to numbers
        const newP1 = parseInt(bits.slice(0, 8).join(""), 2);
        const newP2 = parseInt(bits.slice(8, 16).join(""), 2);
        const newP3 = parseInt(bits.slice(16, 24).join(""), 2);
        const newP4 = parseInt(bits.slice(24, 32).join(""), 2);
        draft.ipv4 = [newP1, newP2, newP3, newP4, prefixLength];
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
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch],
  );

  return <AppStateContext value={contextValue}>{children}</AppStateContext>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
