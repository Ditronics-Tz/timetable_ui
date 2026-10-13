# A1 frontend performance measurements

Measurements are taken against a production build with `VITE_API_URL` set, on the same machine and Chrome version where possible. Build output sizes are deterministic; browser timings are single-run observations and should be treated as directional until repeated in Lighthouse CI.

## Baseline (before A1 changes)

| Measurement | Result |
| --- | ---: |
| Initial JavaScript bundle | 562,960 bytes minified (173,427 bytes transferred/gzip) |
| Initial CSS bundle | 45,280 bytes minified (9,368 bytes transferred/gzip) |
| Mobile emulation viewport | 390 × 844 |
| CPU/network profile | 4× CPU slowdown; 150 ms latency; 1.6 Mbps down / 750 Kbps up |
| First Contentful Paint | 1,220 ms |
| Largest Contentful Paint | 1,220 ms |
| Total Blocking Time estimate | 0 ms |

The baseline browser timings were collected from Chrome's Performance API via the DevTools Protocol. Lighthouse CLI setup could not complete in this environment, so these timings are explicitly not presented as a Lighthouse report. The full Lighthouse before/after run remains a follow-up; rerun it against a production preview with the Lighthouse CLI before making a release claim.

## After route splitting and A1 performance changes

| Measurement | Baseline | After | Change |
| --- | ---: | ---: | ---: |
| Initial JavaScript transferred (gzip) | 173,427 bytes | 126,157 bytes | 27.2% smaller |
| Main entry JavaScript (minified) | 562,960 bytes | 112,456 bytes | 80.0% smaller |
| Main entry JavaScript (gzip) | 173,427 bytes | 37,407 bytes | 78.4% smaller |
| Base CSS (gzip) | 9,368 bytes | 9,093 bytes | 2.9% smaller |

The post-change JavaScript estimate sums the entry and its static vendor chunks (React, router, and UI); route-specific chunks load when a route is opened. Build output: 50 JavaScript chunks, 470.7 KiB total minified. The CI entry budget is 130 KiB; the built entry is 107.2 KiB.

The same Chrome Performance API/LCP run has not yet been captured after the changes. Lighthouse CLI installation repeatedly stalled in this environment, so Lighthouse-specific before/after metrics remain unverified. Do not interpret the transferred asset sizes as LCP or a Lighthouse score.

## Dependency audit

The lockfile was refreshed to patched compatible releases of Axios (1.20.0) and React Router (7.18.4). `npm audit --omit=dev --audit-level=high` reports zero production vulnerabilities. A full development-dependency audit still reports 14 advisories (including critical findings in the currently pinned Vitest/Tinypool toolchain and high findings in Tailwind's current major line); these require a separately reviewed tooling upgrade, so the launch CI gate checks production dependencies only for now.
