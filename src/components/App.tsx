import { useAppState } from "./AppStateProvider";
import { Footer } from "./Footer";
import { IPModeSwitcher } from "./IPModeSwitcher";
import { IPv4App } from "./IPv4App";
import { IPv6App } from "./IPv6App";

export function App() {
  const { mode } = useAppState();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto my-10 flex w-full max-w-2xl flex-1 flex-col items-stretch gap-8 px-4 md:px-0">
        <h1 className="text-center text-4xl font-semibold">CIDR Visualizer</h1>
        <IPModeSwitcher />
        {mode === "IPv4" ? <IPv4App /> : <IPv6App />}
      </div>
      <Footer />
    </div>
  );
}
