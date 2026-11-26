// Writes review.zip, the source map artifact the Webflow Marketplace asks
// for with a submission: the source map of the same build as bundle.zip
// (external, so index.js is byte for byte the one in the bundle), with
// package.json and package-lock.json.
//   npm run review
import { execFileSync } from 'node:child_process'
import { copyFileSync, readFileSync, rmSync } from 'node:fs'
import * as esbuild from 'esbuild'
import { options } from './build.js'

const DIR = 'review'

rmSync(DIR, { recursive: true, force: true })
rmSync('review.zip', { force: true })
await esbuild.build({
    ...options,
    outfile: `${DIR}/index.js`,
    sourcemap: 'external',
    logLevel: 'warning',
})

const built = readFileSync(`${DIR}/index.js`)
if (!built.equals(readFileSync('dist/index.js'))) {
    throw new Error('dist/index.js is out of date: run npm run bundle first')
}
for (const file of ['package.json', 'package-lock.json']) {
    copyFileSync(file, `${DIR}/${file}`)
}
execFileSync(
    'zip',
    [
        '-q',
        '../review.zip',
        'index.js.map',
        'package.json',
        'package-lock.json',
    ],
    { cwd: DIR, stdio: 'inherit' },
)
rmSync(DIR, { recursive: true })
console.log('review.zip')
