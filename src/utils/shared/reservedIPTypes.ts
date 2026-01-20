/**
 * Shared types for reserved IP address detection
 */

export interface ReservedIPInfo {
  name: string;
  description: string;
  rfc?: string;
}

export interface ReservedIPMatch extends ReservedIPInfo {
  cidr: string;
}
