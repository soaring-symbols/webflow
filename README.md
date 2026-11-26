# Soaring Symbols for Webflow

A Webflow Designer extension to search airlines by name, IATA or ICAO code and insert their [Soaring Symbols](https://github.com/soaring-symbols/soaring-symbols) logos, icons and tails into your pages, along with the marks of airline alliances.

> [!NOTE]
> The extension isn't on the Webflow Marketplace yet. Try it by running it as a development app, as described under [Development](#development).

- Search 180+ airlines by name, other names they go by (SWISS), IATA or ICAO code, callsign or slug, and alliances (oneworld, SkyTeam, Star Alliance) by name. Cargo airlines are marked "Cargo", and searching "cargo" lists them.
- Select an element on the page, then click a mark: it goes inside the element as an image, or right after it when the element can't hold one.
- Marks are uploaded to the site's assets, into a "Soaring Symbols" folder, with alt text naming the airline (e.g. "Vietnam Airlines logo"). Inserting the same mark again reuses its asset.
- Pick the size of inserted marks (16 to 256 px), set by a class (`soaring-symbols-64`) you can restyle for every mark of that size, and the color of monochrome marks, or use the airline's primary color. Both are remembered.
- Each mark type gets a row with its color, mono and dark-background versions in columns; the dark one is shown on a dark preview.
- Airlines that changed their logo also list their earlier marks, under the years each was used.

## Development

Node 22.18 or newer.

```bash
npm install
npm run dev
```

`npm run dev` rebuilds on change and serves the extension at `http://localhost:1337`. In Webflow, create an app for your workspace (**Workspace settings → Apps & Integrations → Develop**) with the Designer Extension building block, install it on a site, then open the site in the Designer and launch the development app from the **Apps** panel.

| Command             | What it does                                                     |
| :------------------ | :--------------------------------------------------------------- |
| `npm run build`     | Build `dist/index.html` and `dist/index.js` with esbuild.        |
| `npm run dev`       | Rebuild on every change and serve the extension.                 |
| `npm run bundle`    | Build and write `bundle.zip`, to upload as an extension version. |
| `npm run typecheck` | Type-check with TypeScript.                                      |
| `npm run lint`      | ESLint and Prettier.                                             |
| `npm test`          | Unit tests for the helpers in `src/` (Node test runner).         |

## License

The extension's code is [MIT](LICENSE). The airline marks are trademarks of their owners; read the package's [Disclaimer](https://github.com/soaring-symbols/soaring-symbols/blob/main/DISCLAIMER.md) before using them.
