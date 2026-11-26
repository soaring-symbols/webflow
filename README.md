# Soaring Symbols for Webflow

A Webflow Designer extension to search airlines by name, IATA or ICAO code and insert their [Soaring Symbols](https://github.com/soaring-symbols/soaring-symbols) logos, icons and tails into your pages, along with the marks of airline alliances.

> [!NOTE]
> The extension isn't on the Webflow Marketplace. Add it to your own workspace as a private app, as described under [Add it to your workspace](#add-it-to-your-workspace).
>
> Submitting it takes many steps, a demo video for Webflow's review team among them, and that is where it stopped. If you'd like to help record one, [open an issue](https://github.com/soaring-symbols/webflow/issues) with a link to it on Loom or YouTube, as Webflow asks, and I'll give the Marketplace another try. Everything else the form asks for is ready in [`store/`](store/).

- Search 180+ airlines by name, other names they go by (SWISS), IATA or ICAO code, callsign or slug, and alliances (oneworld, SkyTeam, Star Alliance) by name. Cargo airlines are marked "Cargo", and searching "cargo" lists them.
- Select an element on the page, then click a mark: it goes inside the element as an image, or right after it when the element can't hold one.
- Marks are uploaded to the site's assets, into a "Soaring Symbols" folder, with alt text naming the airline (e.g. "Vietnam Airlines logo"). Inserting the same mark again reuses its asset.
- Pick the size of inserted marks (16 to 256 px), set by a class (`soaring-symbols-64`) you can restyle for every mark of that size, and the color of monochrome marks, or use the airline's primary color. Both are remembered.
- Each mark type gets a row with its color, mono and dark-background versions in columns; the dark one is shown on a dark preview.
- Airlines that changed their logo also list their earlier marks, under the years each was used.

- The panel follows the Designer's light and dark appearance.

## Add it to your workspace

You need Node 22.18 or newer to build it, and a Webflow account that is an admin of the workspace with two-factor authentication on, which Webflow asks for before it takes an extension upload.

1. Build the extension:

    ```bash
    git clone https://github.com/soaring-symbols/webflow.git
    cd webflow
    npm install
    npm run bundle
    ```

    This writes `bundle.zip`.

2. In Webflow, open **Workspace settings → Apps & Integrations → Develop** and create an app: name it Soaring Symbols, upload `store/icon.png` as its icon, and turn on the **Designer Extension** building block. It needs no Data API scopes.
3. In the app, choose **Publish extension version** and upload `bundle.zip`.
4. Install the app on a site from the same page.
5. Open the site in the Designer, press E for the **Apps** panel, choose **Soaring Symbols** and **Launch App**.

To insert a mark, select an element on the page, find the airline in the panel and click the mark. New airlines and fixed marks reach the app on their own, from the soaring-symbols package on jsDelivr; a new version of the app itself means pulling, running `npm run bundle` again and uploading the new `bundle.zip`.

## Development

Node 22.18 or newer.

```bash
npm install
npm run dev
```

`npm run dev` rebuilds on change and serves the extension at `http://localhost:1337`. In Webflow, create an app for your workspace (**Workspace settings → Apps & Integrations → Develop**) with the Designer Extension building block, install it on a site, then open the site in the Designer and launch the development app from the **Apps** panel. Chrome blocks a public page from loading `localhost` until you allow **Local network access** for the Designer's site; uploading `bundle.zip` avoids it.

### Try the panel without Webflow

With `npm run dev` running, open `http://localhost:1337` in a browser. The panel lists airlines and shows their marks as it does in the Designer; clicking a mark only logs a notice, since inserting needs the Designer. It starts in the dark theme. To see it as in the Designer:

- narrow the window to 360 × 560, the size the panel asks the Designer for (the browser's device toolbar sets an exact size),
- run `document.documentElement.dataset.theme = 'light'` in the console for the light theme, and `delete document.documentElement.dataset.theme` to go back.

| Command             | What it does                                                     |
| :------------------ | :--------------------------------------------------------------- |
| `npm run build`     | Build `dist/index.html` and `dist/index.js` with esbuild.        |
| `npm run dev`       | Rebuild on every change and serve the extension.                 |
| `npm run bundle`    | Build and write `bundle.zip`, to upload as an extension version. |
| `npm run typecheck` | Type-check with TypeScript.                                      |
| `npm run lint`      | ESLint and Prettier.                                             |
| `npm test`          | Unit tests for the helpers in `src/` (Node test runner).         |

## Publishing

How to upload a new extension version and submit it to the Webflow Marketplace is in [`store/PUBLISHING.md`](store/PUBLISHING.md); the listing fields and images are in [`store/LISTING.md`](store/LISTING.md).

## License

The extension's code is [MIT](LICENSE). The airline marks are trademarks of their owners; read the package's [Disclaimer](https://github.com/soaring-symbols/soaring-symbols/blob/main/DISCLAIMER.md) before using them.
