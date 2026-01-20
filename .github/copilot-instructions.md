# CIDR Visualizer - AI Coding Agent Instructions

## Project Overview

CIDR Visualizer is an interactive web app for understanding and visualizing IPv4 and IPv6 CIDR notation. Built with React, TypeScript, Vite, and Tailwind CSS. Deployed via CapRover to `cidr.etienne.tech`.

## Architecture

### Core Data Structures

- **IPv4CIDR**: `[p1, p2, p3, p4, prefixLength]` - tuple where each `p` is 0-255 octets
- **IPv6CIDR**: `[p1-p8, prefixLength]` - tuple where each `p` is 16-bit parts (0-65535)
- Both types imported from `src/utils/ipv4.ts` which also defines `IPv4`, `IPv6` without prefix

**Key insight**: Using tuples instead of objects allows efficient bitwise operations and keeps parsing simple.

### State Management Pattern

- `AppStateProvider` (React Context + useReducer with Immer) manages global state in `src/components/AppStateProvider.tsx`
- State shape: `{ mode: "IPv4" | "IPv6", ipv4: IPv4CIDR, ipv6: IPv6CIDR }`
- Actions dispatched: `SetMode`, `SetIPv4`, `SetIPv6`, `RandomPrefixIPv4`, `RandomPrefixIPv6`, `RandomIPInNetworkIPv4`, `RandomIPInNetworkIPv6`
- Uses Immer for immutable updates

### Component Structure

```
App.tsx (top-level, renders mode selector)
├── IPModeSwitcher (toggle between IPv4/IPv6)
├── IPv4App.tsx (IPv4-specific UI)
│   ├── IPv4Input (CIDR input field)
│   ├── IPv4Bits (binary visualization grid)
│   ├── ActionButton (random, copy buttons)
│   ├── NetworkInfoDisplay (calculated network info)
│   └── ReservedIPInfo (displays if IP is reserved)
├── IPv6App.tsx (IPv6 equivalent structure)
└── Footer (static links)
```

### Utility Modules - Separation by Responsibility

**IP Parsing (`src/utils/parse*.ts`)**

- `parseIPv4String()` - regex match on `XXX.XXX.XXX.XXX/XX`, validates octets 0-255, prefix 0-32
- `parseIPv6String()` - handles both `::` compression and full notation, validates 16-bit parts and prefix 0-128
- `detectIPType()` - tries both parsers, returns `{ ipv4, ipv6 }` to let UI decide

**IP Calculations (`src/utils/ipv4.ts`, `src/utils/ipv6.ts`)**

- `getIPv4Mask(prefixLength)` - bitwise mask generation for network bits
- `getIPv6Mask(prefixLength)` - 16-bit equivalent
- `generateRandomIPv4CIDR()`, `generateRandomIPv6CIDR()` - creates random IPs while respecting prefix (zeroes host bits)
- `generateRandomIPv4InNetwork()` - generates random host within existing network

**Network Info (`src/utils/networkInfo.ts`)**

- `calculateIPv4NetworkInfo()` - returns: `{ networkAddress, broadcastAddress, firstHost, lastHost, hostCount }`
- `calculateIPv6NetworkInfo()` - IPv6 equivalent (no broadcast concept)

**Reserved IPs (`src/utils/reservedIPv4.ts`, `src/utils/reservedIPv6.ts`)**

- Maps reserved IP ranges (10.x.x.x, 127.x.x.x, 169.254.x.x, etc.)
- `checkIPv4Reserved()`, `checkIPv6Reserved()` - return `{ type: string, description: string }` or null

## Build & Deployment

**Development**: `pnpm dev` - Vite dev server at localhost:5173
**Build**: `pnpm build` - runs `tsc -b && vite build`, outputs to `/dist`
**Deploy**: `pnpm deploy` - builds, tars dist (excluding `.map`), deploys via CapRover

**Linting**: `oxlint` (type-aware, faster than ESLint)
**Formatting**: `oxfmt` (Rust formatter, mirrors project style)
**Type checking**: `tsc` or `tsc --watch`

**Deployment Stack**:

- `captain-definition` configures Docker: nginx SPA on top of `socialengine/nginx-spa:latest`
- `/dist` contents copied into nginx app directory
- CapRover CLI used for deployment authentication

## Key Patterns & Conventions

### Styling

- Tailwind CSS only, no CSS modules
- Use `cn()` utility from `src/utils/styles.ts` (combines `clsx` + `tailwind-merge`)
- Highlight colors from `getHighlightColor()` in `src/utils/colors.ts` - 12-color rotation array

### Component Patterns

- Functional components with hooks (React 19)
- Use `Fragment` from `react/jsx-runtime` for render optimization (React Compiler enabled)
- State isolated per component (hover highlight, copy feedback) via `useState`

### Bitwise Operations

- IPv4: Work in octets (8-bit), use `Math.floor(i / 8)` for byte index, `7 - (i % 8)` for bit offset
- IPv6: Work in 16-bit parts, use `Math.floor(i / 16)` for part index, `15 - (i % 16)` for bit offset
- Mask application: `part & mask[index]` to zero host bits

### UI Interactions

- "Copy to clipboard" buttons show temporary feedback state
- "Random" buttons dispatch actions through AppState reducer
- Click-to-parse pattern: clicking formatted CIDR text parses and updates state

## Testing & Validation

No automated tests currently present. Manual testing focuses on:

- Edge cases: prefix length boundaries (0, 32 for IPv4; 0, 128 for IPv6)
- IPv6 `::` compression in various positions
- Reserved IP type detection
- UI responsiveness (max-w-2xl container, Tailwind breakpoints)

## Common Tasks

**Adding a new reserved IP range**: Update `src/utils/reservedIPv4.ts` or `src/utils/reservedIPv6.ts` with range check and type/description.

**Fixing IP parsing bug**: Check regex in `parseIPv4String.ts` or IPv6 logic in `parseIPv6String.ts`. Remember tuple index for prefix is last element.

**Adding UI feature**: First determine if state changes are needed (update AppStateProvider actions), then build component using `useAppState()` hook.

**Tweaking visualization**: Color scheme in `src/utils/colors.ts`, grid layout and Tailwind classes in `IPv4Bits.tsx` / `IPv6Bits.tsx`.
