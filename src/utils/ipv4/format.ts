import type { IPv4 } from "./types";

export function formatIPv4(ip: IPv4): string {
  return `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
}

export function formatCount(count: bigint): string {
  return new Intl.NumberFormat("en-US").format(count);
}
