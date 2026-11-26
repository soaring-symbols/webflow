# Webflow listing

<!-- markdownlint-disable no-bare-urls -->
<!-- The app settings and the Marketplace form ask for some of the same fields -->
<!-- markdownlint-configure-file { "no-duplicate-heading": { "siblings_only": true } } -->

What to fill in for the app in Webflow, in two places: the app's settings (**Workspace settings → Apps & Integrations → Develop → the app → App info**) and the Marketplace submission form (<https://developers.webflow.com/submit>, **New App**, or **App Update** later). Keep this file in step with what is set there.

## Images

Copied from `exports/webflow/` in [soaring-symbols/brand](https://github.com/soaring-symbols/brand), which renders them; change them there first.

- App icon (app settings): `store/icon.png`, 256×256.
- Logo (Marketplace): `store/logo.png`, 900×900, under 50 KB. Alt text: Soaring Symbols logo: the letters S S on two dark split-flap tiles, like a departure board, on a yellow square.
- Screenshots (Marketplace, 1280×846, four to five), in this order, with their alt text:
    1. `store/screenshot-insert.png`: The Soaring Symbols panel beside a page, with the Vietnam Airlines logo just inserted into the selected element.
    2. `store/screenshot-search.png`: The panel listing the airline alliances and airlines, with a search field for names and codes.
    3. `store/screenshot-versions.png`: Vietnam Airlines' logo, stacked logo and icon in color, monochrome and dark-background versions.
    4. `store/screenshot-light.png`: The panel in the Designer's light appearance, with Japan Airlines' marks and its monochrome marks in the airline's red.

## App settings

### App name

Soaring Symbols

### App description

Fewer than 140 characters.

Search 180+ airlines and alliances by name or IATA/ICAO code, and insert their logos, icons and tails into your page as SVG images.

### App homepage URL

https://soaringsymbols.org/ecosystem

### Restrict App installation to a specific site

Off.

## Marketplace form

### App name

Soaring Symbols (30 characters at most, without "Webflow").

### Short description

100 characters at most.

Search 180+ airlines and alliances, then insert their logos, icons and tails into your page as SVG.

### Long description

The form's App detail description: 10,000 characters at most, Markdown but no links (they don't render and may be flagged in review). Name the destinations instead; their URLs go in the website and support fields.

```markdown
Soaring Symbols brings a curated collection of airline logos, icons and tail designs into the Webflow Designer, along with the marks of the airline alliances. Find an airline, click a mark, and it lands on your page as an SVG image.

**Find an airline**

- Search 180+ airlines by name, other names they go by (SWISS), IATA code (VN), ICAO code (HVN), callsign or slug.
- Every airline shows its codes, country and alliance; cargo airlines and airlines that have ceased operations are marked.
- The oneworld, SkyTeam and Star Alliance marks are there too.

**Insert its marks**

- Select an element on the page, then click a logo, icon or tail: it goes inside the element as an image, or right after it when the element can't hold one.
- Each mark is uploaded to your site's assets, in a "Soaring Symbols" folder, with alt text naming the airline. Inserting the same mark again reuses its asset.
- Pick the size, from 16 to 256 px. It is set by a class (soaring-symbols-64) that you can restyle for every mark of that size at once.
- Use the color version, a monochrome one in any color or the airline's primary color, or the version made for dark backgrounds.
- Airlines with a stacked logo offer it beside the horizontal one, and airlines that changed their logo also list their earlier marks.

**Always up to date**

The marks come from the open-source Soaring Symbols collection, so new airlines and fixed SVGs show up without an app update. The app has no account, collects no data and talks to no server of ours. Missing an airline or spotted an outdated logo? Contribute on GitHub, linked from the Soaring Symbols website.

Logos and icons are shown for reference. The trademarks belong to their airlines; Soaring Symbols claims no ownership of them.
```

### Features

Five at most, one short line each: the form cuts longer ones (around 40 characters).

1. Search 180+ airlines by name or code
2. One-click insert into the selection
3. Saved to Assets with alt text
4. Color, mono and dark versions
5. Earlier logos of rebranded airlines

### App capabilities

Assets, the only one: the app uploads the marks it inserts to the site's assets. It does that through the Designer API, so the app requests no Data API scope; the review notes say so.

### Scope justification

```text
Assets (no Data API endpoint): the app is a Designer Extension and requests no Data API scope or OAuth token. Its one feature, inserting an airline or alliance mark, uploads the mark's SVG to the site's assets and places it on the page, all through the Designer API in the Designer: webflow.createAsset(file) to upload the SVG, asset.setAltText(name) and asset.setParent(folder) to add alt text and file it in a "Soaring Symbols" folder (webflow.getAllAssets, webflow.getAllAssetFolders and webflow.createAssetFolder to find or create them), then webflow.elementPresets.Image with element.append/after, image.setAsset, image.setAltText and image.setStyles to insert it, with webflow.createStyle for the size class (soaring-symbols-64). Nothing is read from or written to the site outside the Designer session.
```

### Does your app run server-side code?

No. The extension runs entirely in the Designer's panel. It fetches the airline list and SVG files from jsDelivr's public CDN (cdn.jsdelivr.net, data.jsdelivr.com), a third-party service that hosts the open-source soaring-symbols npm package; there is no server of ours.

### Categories

Two at most: Design and Asset Management. The form offers no Icons category.

### Links

- Website: https://soaringsymbols.org/ecosystem
- Privacy policy: https://soaringsymbols.org/privacy
- Terms of service: https://soaringsymbols.org/terms
- Support email: the maintainer's, typed into the form (not kept in the repository).
- Test site: https://soaring-symbols.webflow.io, with the app installed: a one-screen hero whose row of airline and alliance marks was inserted with the app.

### Review notes

```text
A Designer Extension only: no Data API scopes, no OAuth, no backend and no account. It loads the airline list and SVG files of the open-source soaring-symbols npm package from jsDelivr (cdn.jsdelivr.net, data.jsdelivr.com). To try it: open any page, select an element (a Div Block), search "Vietnam Airlines" in the panel and click a mark. It is uploaded to the site's assets (folder "Soaring Symbols") and inserted as an Image with the class soaring-symbols-64. The size and mono color are kept in the panel's localStorage. Test site: https://soaring-symbols.webflow.io (its row of marks was inserted with the app). Source: https://github.com/soaring-symbols/webflow
```

### Source map artifact

`npm run review` writes `review.zip` (git-ignored): the source maps of the same build as `bundle.zip`, `package.json` and `package-lock.json`.

### Before submitting

- Upload `bundle.zip` (`npm run bundle`) as a new extension version, and test it with **Launch app**.
- Run Webflow's App Review Preflight on `bundle.zip` and `review.zip`, and paste its receipt (`wfpre_…`) into the form.
- Keep the app installed on the test site, https://soaring-symbols.webflow.io, and republish it after changing it.
- Record the demo video (2 to 5 minutes, Loom or unlisted YouTube): installing the app, then searching, inserting a mark and changing its size and mono color.
