# Soccer Odds - Best Lines Finder

Compare soccer betting odds across sportsbooks to find the best lines, benchmarked against Pinnacle's no-vig fair price.

Live at: https://airtightsake.github.io/soccer-odds/

## Quick Start

1. **Open the app** (link above, or open `index.html` locally)
2. **Enter your API key**: from https://the-odds-api.com (paid plans unlock Caesars, Fanatics, and Bet365 AU)
3. **Select a league**: 60+ soccer leagues worldwide
4. **Click "Load Odds"**: best available price per outcome, with the source book and its edge vs fair value

## Features

- **Best odds finder**: highest price per outcome across your selected books
- **Edge badges**: every price shows its % edge vs Pinnacle's de-vigged fair price — green = +EV, gray = slightly below fair, red = 5%+ below fair. Hover a badge for the fair price itself.
- **Markets**: 3-way moneyline, Over/Under lines, Asian Handicap lines, BTTS (fetched per match on demand)
- **Alt-lines fill**: one click pulls `alternate_totals` for every match (1 credit each) — this is how FanDuel/BetMGM/Pinnacle O/U prices reach the 2.5/3.5 columns, since most US books post no *featured* soccer totals in the API
- **Cost-efficient API usage**: requests only your selected books via the `bookmakers` parameter (each group of 10 books bills as 1 region). "Last call" badge shows what each request actually cost; "Credits left" tracks your quota.
- **Persistent settings**: book and line selections, odds format (decimal/American), and API key survive reloads (localStorage)
- **PWA**: installable on mobile/desktop, offline shell via service worker

## How the fair price works

Pinnacle is fetched with every request as the benchmark (it never appears as a "best" price). For each market, the vig is removed by scaling prices by the market's total implied probability (the overround): `fair odds = price × overround`. The edge shown is `best price / fair price − 1`.

## Bookmaker notes

- `williamhill_us` = Caesars
- Caesars and Fanatics require a paid API subscription — on a free key they silently return no odds
- theScore Bet (`espnbet`): feed has returned no data since the Dec 2025 ESPN Bet rebrand (verified empirically); removed from the book list
- Bet365: only exists as `bet365_au`, which covers AFL/NRL only — bet365 soccer odds are not available in this API at any tier
- FanDuel/DraftKings/Fanatics return no *featured* soccer totals (verified even for the 2026 World Cup final); FanDuel's soccer O/U ladder is available via `alternate_totals` on the per-event endpoint — hence the alt-lines fill button

## Files

- `index.html` — the entire application (no build step)
- `manifest.json` — PWA configuration
- `sw.js` — service worker (network-first for the page, cache-first for static assets)
- `icon-192.png` / `icon-512.png` — app icons

## Deploying

GitHub Pages serves the `main` branch of `airtightsake/soccer-odds` at the URL above. Push to `main` and the site updates in a minute or two (the service worker fetches the page network-first, so no stale caches).
