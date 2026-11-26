import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DEFAULT_SETTINGS, parseSettings } from '../src/settings.ts'

describe('parseSettings', () => {
    it('keeps saved values the extension offers', () => {
        assert.deepEqual(parseSettings({ size: 128, monoColor: '#0a2240' }), {
            size: 128,
            monoColor: '#0a2240',
        })
    })

    it('falls back to the defaults for anything else', () => {
        assert.deepEqual(parseSettings(null), DEFAULT_SETTINGS)
        assert.deepEqual(
            parseSettings({ size: 100, monoColor: 'red' }),
            DEFAULT_SETTINGS,
        )
    })
})
