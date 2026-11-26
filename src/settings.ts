// The extension's settings, kept in the browser's localStorage, which a
// private window or blocked site data can leave empty or unusable

export interface Settings {
    /** Width and height of an inserted mark, in pixels. */
    size: number
    /** Six-digit hex color that mono marks are painted with. */
    monoColor: string
}

export const DEFAULT_SETTINGS: Settings = { size: 64, monoColor: '#000000' }

export const SIZES = [16, 24, 32, 48, 64, 96, 128, 256]

const KEY = 'soaring-symbols:settings'

const HEX = /^#[0-9a-f]{6}$/i

// Saved settings over the defaults, keeping only values the extension offers
export const parseSettings = (saved: unknown): Settings => {
    const value = (saved ?? {}) as Partial<Settings>

    return {
        size: SIZES.includes(Number(value.size))
            ? Number(value.size)
            : DEFAULT_SETTINGS.size,
        monoColor:
            typeof value.monoColor === 'string' && HEX.test(value.monoColor)
                ? value.monoColor
                : DEFAULT_SETTINGS.monoColor,
    }
}

export const loadSettings = (): Settings => {
    try {
        return parseSettings(JSON.parse(localStorage.getItem(KEY) ?? 'null'))
    } catch {
        return { ...DEFAULT_SETTINGS }
    }
}

export const saveSettings = (settings: Settings): void => {
    try {
        localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
        // Not remembered, which only costs picking them again next time
    }
}
