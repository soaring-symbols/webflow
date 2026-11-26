# AGENTS.md

Instructions for AI coding agents working on the Soaring Symbols Webflow extension. Human-facing docs live in `README.md`.

## Project

A Webflow Designer Extension (the panel of a Webflow App) that searches the [Soaring Symbols](https://github.com/soaring-symbols/soaring-symbols) airlines and alliances and inserts their logos, icons and tails into a page. It follows the [Figma plugin](https://github.com/soaring-symbols/figma): `src/data.ts` and its tests started as copies of that plugin's, so a fix to one usually belongs in the other.

- `webflow.json` — the extension manifest: `apiVersion` `"2"`, `size` and `publicDir` (`dist`, which the CLI serves and bundles).
- `src/index.html` — the panel's markup and styles. Only what goes in `<body>`: the Webflow CLI and the Designer wrap it in a page of their own that loads the Designer API (the `webflow` global) before `index.js`. It is dark by default and light under `data-theme="light"`, which `followTheme` in `src/designer.ts` sets from the Designer's appearance (`getTheme` and the `currenttheme` event). That page declares no charset, so the markup stays ASCII: write `&larr;`, not the character.
- `src/ui.ts` — the panel: the list and search (alliances with marks first, then airlines), the marks of an airline or alliance (a row per mark type, a column per file: color, mono, dark background), the column names as pills, and under them on the same three columns the size and the mono color (a picker, and the primary color in one click), and a footer whose tip changes with the view. It fetches everything from jsDelivr.
- `src/designer.ts` — everything that calls the Designer API: a clicked mark is uploaded to the site's assets (into a "Soaring Symbols" folder, with alt text) and inserted as an Image element into the selected element, or after it when it can't hold children, sized by a shared class (`soaring-symbols-<size>`, width and height in px). It checks `canForAppMode` first and says what's missing.
- `src/data.ts` — pure helpers shared by the panel and the tests: data URLs (`DATA_LINE`), search ranking, asset tiles for an airline or an alliance, older marks from `history`, tinting mono SVGs, and `assetFileName`, the name a mark is uploaded under.
- `src/settings.ts` — the size and mono color, kept in `localStorage` (which may throw or come back empty; the defaults apply then).
- `scripts/review.js` — `review.zip` for a Marketplace submission: the same build with an external source map (it checks `index.js` matches `dist/`), plus `package.json` and `package-lock.json`.
- `scripts/build.js` — esbuild: `src/ui.ts` → `dist/index.js`, and `src/index.html` copied next to it. No source maps: the Marketplace refuses a bundle that ships them.
- `store/` — what the app's settings in Webflow show: `LISTING.md` (the App info fields and the Marketplace form), `icon.png` (256×256), `logo.png` (900×900) and the screenshots (1280×846), copied from `exports/webflow/` in [soaring-symbols/brand](https://github.com/soaring-symbols/brand), where they are rendered; change them there first.
- `test/` — unit tests for `src/data.ts` and `src/settings.ts`, run by Node's test runner with type stripping.

### Where the data comes from

As in the Figma plugin: `airlines.json`, `alliances.json` and the SVGs come from the published `soaring-symbols` npm package through jsDelivr, pinned to one release line (`DATA_LINE`, `"0.<minor>"`, in `src/data.ts`), read from the exact release the line points at (`RESOLVE_URL`, `setDataVersion`), with the lists bundled from the `soaring-symbols` dependency as the fallback.

The extension's own versions follow the package release they were built against (`version` in `package.json`, e.g. `0.6.1`), and name the version uploaded to Webflow and its notes.

When the library releases a new minor line, update the extension in one change: set `DATA_LINE`, move the `soaring-symbols` dependency to the line (`npm install soaring-symbols@^0.<minor>.0`, plus `bun install`), adapt the code, and upload a new extension version.

### Assets on the site

A mark's asset is named by `assetFileName`: slug, file, the year of an older mark, the mono color, and the release (`vietnam-airlines-logo-mono-0a2240-0.6.1.svg`). Inserting the same file of the same release again reuses the asset, found by name among the site's assets; a new release uploads a new one, so a redrawn mark never changes a page that already shows the old one.

## Commands

| Command             | What it does                                                                                                                 |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`     | Build `dist/` (git-ignored).                                                                                                 |
| `npm run dev`       | Rebuild on change and serve `dist/` at `http://localhost:1337` for the Designer.                                             |
| `npm run bundle`    | Build, then `webflow extension bundle` writes `bundle.zip` (git-ignored) to upload.                                          |
| `npm run review`    | Write `review.zip` (git-ignored), the source map artifact for a Marketplace submission, from the same build as `bundle.zip`. |
| `npm run typecheck` | `tsc --noEmit`, with the Designer API types from `@webflow/designer-extension-typings`.                                      |
| `npm run lint`      | ESLint, then Prettier in check mode.                                                                                         |
| `npm run format`    | Prettier.                                                                                                                    |
| `npm test`          | `node --test` on `test/**/*.test.ts` (Node 22.18+).                                                                          |

Dependencies are tracked in both `package-lock.json` and `bun.lock`; update both together. The Webflow CLI (`@webflow/webflow-cli`) is a dev dependency, so the scripts need no global install.

## Gotchas

- Mono SVGs are drawn in `currentColor`, which an `<img>` draws in black, so the panel replaces it with the chosen color (`tintSvg`) before uploading.
- The Designer API only works inside the Designer. Opened on its own (`npm run dev`, then `http://localhost:1337` in a browser), the panel lists airlines and marks, the Webflow script logs that it isn't running in Webflow, and a click only logs a notice (`inDesigner` in `src/designer.ts`).
- The Designer has no drag and drop from an extension onto the canvas: marks are inserted into the selected element.
- In the panel, a key handler that moves focus to a button must `preventDefault()`, or the same key press clicks that button.
- The size and mono color row (`#controls`) moves into the detail view's marks while an airline is shown, and leaves the document when the list replaces them; `ui.ts` keeps references to it and its parts, so never look them up by id after the first airline.

## Conventions

- Prettier (4 spaces, single quotes, no semicolons, trailing commas, width 80) and ESLint with `typescript-eslint`, including a blank line before `return`, as in the library repo.
- Commits follow Conventional Commits, e.g. `feat: insert marks into the selected element`.
