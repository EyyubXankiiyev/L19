# Laboratory 19

React frontend, SCSS styling, Python JSON API. Requires Node 22.12+ and Python 3.10+.

## Development

Run `npm install`, then start these in separate terminals:

```sh
python backend/server.py
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to Python on port 8001.

## Built application

```sh
npm run build
python backend/server.py
```

Open http://localhost:8001. Python serves the build and API together. The standard-library server is for local use.

## Editing

- `src/App.jsx`: React page, language and menu state.
- `src/components.jsx`: interactive research explorer, searchable materials, accessible dialogs and overview download.
- `src/Hero.jsx`: laboratory introduction and research-field index.
- `src/MethodExplorer.jsx`: keyboard-accessible method explorer with explanations.
- `src/QuickSearch.jsx`: site-wide search, available with Ctrl/Cmd+K.
- `src/ui.js`: bilingual interface text.
- `src/styles.scss`: SCSS variables and responsive styles.
- `src/_refinement.scss`: logo-aligned institutional styling and print layout.
- `backend/content.json`: bilingual content, read on each API request.
- `src/content.json`: bundled fallback used when the API is unavailable, automatically synchronized from backend content before every production build.

### News and publications

Edit both language objects in `backend/content.json`. Add publications as `["Title", "Description"]` pairs in `papersList`. Add news as objects in `news`:

```json
{ "date": "YYYY-MM-DD", "title": "Verified news title", "description": "Approved news text" }
```

The Python API reads the updated file on the next request; refresh the browser to load it. `npm run build` also updates the offline content snapshot. Empty news and publication lists display clear pending-content states.

## Verification

With the frontend and Python servers running:

```sh
npm run test:e2e
python -m unittest discover -s backend
npm run build
```

Browser tests use installed Google Chrome. Set `CHROME_PATH` to use another Chromium executable. Tests cover language persistence, research tabs, search, category filters, dialog focus, file downloads, mobile navigation, responsive bounds and API integration. Screenshots are saved under `artifacts/`.

Search results select the matching method or filter the study list. The page index includes a print action; print styles remove navigation and preserve readable research content.

The current design uses system typography, text-based research entries and a section index. It does not display generated images or decorative scientific models. The earlier artwork remains in `public/images/` as an unused archive; its original prompt is in `docs/visual-assets.md`.

There is no CMS or administrative editor. Equipment, staff composition, activity figures, grants, patents and industry partnerships were added from “Laboratoriya cihazları.pptx.pdf”, presented by laboratory head Rəna Xankişiyeva on 12 October 2026. Both languages are maintained in `backend/content.json`; equipment is searchable and included in the overview download. Source page numbers are shown on equipment cards. Project statuses and activity figures describe the presentation date, not live status. The plant radioprotection results remain labeled as a non-peer-reviewed preprint. Full individual staff profiles and official contact details are still needed.
