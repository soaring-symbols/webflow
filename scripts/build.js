// Builds the extension into dist/, the folder webflow.json serves and
// bundles: index.html as it is, and src/ui.ts bundled into index.js. With
// --watch it rebuilds on change, for `webflow extension serve`.
import { copyFile, mkdir } from 'node:fs/promises'
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

const ctx = await esbuild.context({
    entryPoints: ['src/ui.ts'],
    outfile: `${OUT}/index.js`,
    bundle: true,
    minify: !watch,
    // The Marketplace refuses bundles that ship source maps
    sourcemap: false,
    target: 'es2020',
    format: 'iife',
    logLevel: 'info',
    plugins: [copyPage],
})

if (watch) {
    await ctx.watch()
} else {
    await ctx.rebuild()
    await ctx.dispose()
}
