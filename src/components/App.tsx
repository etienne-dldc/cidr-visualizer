import { useAppState } from "./AppStateProvider";
import { IPModeSwitcher } from "./IPModeSwitcher";
import { IPv4App } from "./IPv4App";
import { IPv6App } from "./IPv6App";

export function App() {
  const { mode } = useAppState();

  return (
    <div className="mx-auto my-10 flex max-w-2xl flex-col items-center gap-8">
      <h1 className="text-center text-4xl font-semibold">CIDR Visualizer</h1>
      <IPModeSwitcher />
      {mode === "IPv4" ? <IPv4App /> : <IPv6App />}
    </div>
  );
}
