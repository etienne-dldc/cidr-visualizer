import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const onClick = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    timerRef.current = setTimeout(() => {
      if (timerRef.current) {
        setCopied(false);
        clearTimeout(timerRef.current);
      }
    }, 2000);
  };

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return (
    <button className="rounded-lg hover:bg-black/10 p-2" onClick={onClick}>
      {copied ? <CheckIcon size={36} /> : <ClipboardIcon size={36} />}
    </button>
  );
}
