// Builds the extension into dist/, the folder webflow.json serves and
// bundles: index.html as it is, and src/ui.ts bundled into index.js. With
// --watch it rebuilds on change, for `webflow extension serve`.
import { copyFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import * as esbuild from 'esbuild'

const watch = process.argv.includes('--watch')
const OUT = 'dist'

const copyPage = {
    name: 'copy-page',
    setup(build) {
        build.onEnd(async (result) => {
            if (result.errors.length) return
            await mkdir(OUT, { recursive: true })
            await copyFile('src/index.html', `${OUT}/index.html`)
        })
    },
}

// Shared with scripts/review.js, which builds the same code with its
// source map
export const options = {
    entryPoints: ['src/ui.ts'],
    outfile: `${OUT}/index.js`,
    bundle: true,
    minify: true,
    // The Marketplace refuses bundles that ship source maps
    sourcemap: false,
    target: 'es2020',
    format: 'iife',
}

// Only when run as the build, not when review.js imports the options
const main = import.meta.url === pathToFileURL(process.argv[1]).href
const ctx = main
    ? await esbuild.context({
          ...options,
          minify: !watch,
          logLevel: 'info',
          plugins: [copyPage],
      })
    : undefined

if (!ctx) {
    // Imported for its options
} else if (watch) {
    await ctx.watch()
} else {
    await ctx.rebuild()
    await ctx.dispose()
}
