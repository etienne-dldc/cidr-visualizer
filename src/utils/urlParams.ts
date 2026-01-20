import type { IPv4CIDR } from "./ipv4/ipv4";
import type { IPv6CIDR } from "./ipv6/ipv6";
import { formatIPv6 } from "./ipv6/ipv6";

/**
 * Read the 'ip' parameter from the current URL
 * @returns The IP string from the URL, or null if not present
 */
export function readIPFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("ip");
}

/**
 * Clear the URL parameters from the current URL without adding to history
 */
export function clearURLParams(): void {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url);
}

/**
 * Generate a shareable URL for the given IPv4 CIDR
 * @param ipv4 - IPv4 CIDR tuple
 * @returns Full URL with IP parameter
 */
export function generateIPv4ShareableURL(ipv4: IPv4CIDR): string {
  const cidrString = `${ipv4[0]}.${ipv4[1]}.${ipv4[2]}.${ipv4[3]}/${ipv4[4]}`;
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("ip", cidrString);
  return url.toString();
}

/**
 * Generate a shareable URL for the given IPv6 CIDR
 * @param ipv6 - IPv6 CIDR tuple
 * @returns Full URL with IP parameter
 */
export function generateIPv6ShareableURL(ipv6: IPv6CIDR): string {
  const ipv6String = formatIPv6(ipv6);
  const cidrString = `${ipv6String}/${ipv6[8]}`;
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("ip", cidrString);
  return url.toString();
}
