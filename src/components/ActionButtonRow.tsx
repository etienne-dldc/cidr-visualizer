import { ClipboardIcon, Dice1Icon, DicesIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "./ActionButton";

interface ActionButtonRowProps {
  onRandomNetwork: () => void;
  onRandomIP: () => void;
  cidrString: string;
  ipString: string;
  isRandomNetworkDisabled: boolean;
  isRandomIPDisabled: boolean;
  shareableURL: string;
}

export function ActionButtonRow({
  onRandomNetwork,
  onRandomIP,
  cidrString,
  ipString,
  isRandomNetworkDisabled,
  isRandomIPDisabled,
  shareableURL,
}: ActionButtonRowProps) {
  const [copiedState, setCopiedState] = useState<"cidr" | "ip" | "link" | null>(null);

  const handleCopyCidr = () => {
    navigator.clipboard.writeText(cidrString).catch(() => {});
    setCopiedState("cidr");
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleCopyIP = () => {
    navigator.clipboard.writeText(ipString).catch(() => {});
    setCopiedState("ip");
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableURL).catch(() => {});
    setCopiedState("link");
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      <ActionButton
        icon={DicesIcon}
        label="Random Network"
        onClick={onRandomNetwork}
        disabled={isRandomNetworkDisabled}
        tooltip="Generate a random network address while keeping the same prefix length. Set IP bits to zero."
      />
      <ActionButton
        icon={Dice1Icon}
        label="Random IP"
        onClick={onRandomIP}
        disabled={isRandomIPDisabled}
        tooltip="Generate a random host IP address within the current network"
      />
      <ActionButton icon={ClipboardIcon} label="Copy CIDR" onClick={handleCopyCidr} isCopied={copiedState === "cidr"} />
      <ActionButton icon={ClipboardIcon} label="Copy IP" onClick={handleCopyIP} isCopied={copiedState === "ip"} />
      <ActionButton
        icon={LinkIcon}
        label="Copy Link"
        onClick={handleCopyLink}
        isCopied={copiedState === "link"}
        tooltip="Copy a shareable link with the current IP address"
      />
    </div>
  );
}
