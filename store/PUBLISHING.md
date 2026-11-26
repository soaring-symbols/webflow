# Publishing the Webflow app

How a new version of the extension reaches Webflow: uploaded as an extension version of the app, then, for the Marketplace, submitted for Webflow's review. The fields and images the app's settings and the Marketplace form ask for are in [`LISTING.md`](LISTING.md).

New airlines and fixed marks need no new version: the extension loads them from the soaring-symbols package on jsDelivr. A new version is for the extension's own code or listing, or for a new release line of the package (see "Where the data comes from" in `AGENTS.md`). Workspaces that added the app themselves ("Add it to your workspace" in `README.md`) only get it by uploading the new `bundle.zip` again.

## Before publishing

1. Start from an up-to-date `main` with nothing uncommitted, and run the checks:

    ```bash
    npm run typecheck && npm run lint && npm test
    ```

2. Try the panel at `http://localhost:1337` with `npm run dev` (see "Try the panel without Webflow" in `README.md`), in both themes, at 360 × 560.
3. Set `version` in `package.json` to the soaring-symbols release the extension is built against (e.g. `0.6.1`); it names the version you upload and its notes.
4. If the UI changed, render the screenshots again in [soaring-symbols/brand](https://github.com/soaring-symbols/brand) (`npm run render` there) and copy `exports/webflow/*.png` into `store/` under the same names.
5. If a feature changed, update the descriptions in `LISTING.md`.

## Upload a new extension version

Webflow asks for an admin of the workspace with two-factor authentication on.

```bash
npm run bundle
```

This builds and writes `bundle.zip` (git-ignored). In Webflow, open **Workspace settings → Apps & Integrations → Develop**, the Soaring Symbols app, and choose **Publish extension version**; upload `bundle.zip`, name it after `version` in `package.json` and say what changed. Then open a site in the Designer, press E for the **Apps** panel and **Launch App**: insert a mark by clicking, with an element selected, in both appearances.

## Submit to the Marketplace

Only for the first submission, or when the Marketplace listing or the reviewed build changes.

1. Write the source map artifact from the same build as `bundle.zip`:

    ```bash
    npm run review
    ```

    `review.zip` (git-ignored) holds the source maps, `package.json` and `package-lock.json`; `scripts/review.js` stops if `index.js` doesn't match `dist/`.

2. Run Webflow's App Review Preflight on `bundle.zip` and `review.zip`, and keep its receipt (`wfpre_…`).
3. Fill in the Marketplace form (<https://developers.webflow.com/submit>) from `LISTING.md`: the fields, the logo, the screenshots in their order with their alt text, the review notes, the receipt and `review.zip`. The long description renders no links; name places instead.
4. Submit, and answer Webflow's review if it asks for changes. The app is on the Marketplace once approved.

## After publishing

- Push the commits the version was built from.
- If the update brings a change users notice, add a line for it under `### Ecosystem` in the release notes of the soaring-symbols release that shipped the feature (`docs/RELEASING.md` in the library repo says how).
- Keep `LISTING.md` in step with what is live.
