# Haven

A considered real estate experience built with HTML, CSS, and vanilla JavaScript. No build step, framework, package installation, or API key is required.

## Run locally

From this folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open **http://127.0.0.1:4173/**. `index.html` is the main entry point; `project.html` is an identical compatibility entry for the original project URL. Keep these two files in sync when changing the homepage. Use a local HTTP server so SVG icons and browser storage work consistently.

## What changed

The original site had placeholder navigation, a nonfunctional video button, a stock-watermarked logo, and a subscription form without a destination. The redesign creates a complete browsing experience around a consistent Haven identity:

- An original SVG wordmark, ivory and forest-green palette, editorial typography, and three original generated property images.
- Six illustrative Lagos properties with naira prices and clear annual rent units.
- Combined buy/rent, neighbourhood, property type, and budget search; sorting; empty states; and progressive listing discovery.
- Saved homes retained in browser storage, with malformed or blocked storage handled safely.
- Comparison of up to three homes, including a horizontally scrollable mobile table.
- Accessible native property and article dialogs, keyboard dismissal, focus handling, and reduced-motion support.
- A loan calculator with live amortization, zero-interest support, input validation, and direct transfer of a property's price to the planner.
- Responsive navigation, semantic landmarks, a skip link, visible focus rings, labelled inputs, and status announcements.
- A redesigned newsletter preview that validates the form without sending or storing email addresses.

All assets are served locally. No external font, image, or script request is required.

## Demo boundaries

This is a frontend competition concept. Properties, prices, locations, specifications, and amenities are sample data. Generated photographs illustrate concepts and do not establish that a property exists at a stated location. Some secondary demo listings reuse imagery.

Saved homes are local to the browser; there are no accounts or cross-device sync. Property data is maintained in `project.js`; there is no live inventory service. Newsletter submissions intentionally show a demo explanation, because no email service is configured. The loan planner computes principal and interest only and excludes fees, taxes, insurance, and lender-specific costs.

Before accepting real customers, replace the sample inventory with authorized listings and imagery, add the relevant backend and email provider, and verify all claims and contact details.

## Presenting the experience

1. Start with the home in focus, then use the search to find a Lekki apartment to rent for up to ₦7 million per year.
2. Save a home and reload to show that the shortlist persists.
3. Select two or three homes and compare them side by side.
4. Open a home for sale and choose **Plan your budget** to transfer its price to the calculator.
5. Change the deposit, term, and rate, then show the mobile layout and journal.

## Verification

`scripts/verify.mjs` runs dependency-free checks in a local Chromium browser over its debugging interface. It expects this site on port 4173 and an isolated test browser on debugging port 9222. It tests filters, sorting, storage persistence, empty states, comparison limits, dialogs, calculator results, mobile navigation, the signup preview, and both entry URLs. It also saves screenshots at desktop, tablet, and mobile widths.

The checked report is in `artifacts/verification.json`. Layout previews are in `artifacts/desktop.png`, `artifacts/desktop-full.png`, `artifacts/mobile.png`, and `artifacts/tablet.png`.

```powershell
node --check project.js
node scripts/verify.mjs
```

Image-generation prompts and asset provenance are in `ASSETS.md`.
