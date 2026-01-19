import { useAppState } from "./AppStateProvider";
import { IPModeSwitcher } from "./IPModeSwitcher";
import { IPv4App } from "./IPv4App";
import { IPv6App } from "./IPv6App";

export function App() {
  const { mode } = useAppState();

  return (
    <div className="max-w-2xl mx-auto my-10 flex flex-col gap-8 items-center">
      <h1 className="text-4xl font-semibold text-center">CIDR Visualizer</h1>
      <IPModeSwitcher />
      {mode === "IPv4" ? <IPv4App /> : <IPv6App />}
    </div>
  );
}
