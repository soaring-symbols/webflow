// Everything that talks to the Webflow Designer: a mark is uploaded to the
// site's assets, into a "Soaring Symbols" folder, and placed on the page as
// an Image element sized by a shared class (soaring-symbols-64).

export interface Mark {
    /** The SVG source, already tinted when mono. */
    svg: string
    /** The asset's file name (assetFileName in data.ts). */
    fileName: string
    /** What it shows, for the alt text, e.g. "Vietnam Airlines logo". */
    name: string
    /** Width and height on the page, in pixels. */
    size: number
}

type NoticeType = 'Error' | 'Info' | 'Success' | 'Warning'

export const FOLDER_NAME = 'Soaring Symbols'

// Outside the Designer (the page opened on its own while developing) there
// is no webflow global; notices go to the console then
export const inDesigner = (): boolean => typeof webflow !== 'undefined'

export const notify = (message: string, type: NoticeType = 'Info'): void => {
    if (inDesigner()) {
        webflow.notify({ type, message })
    } else {
        console.info(`[${type}] ${message}`)
    }
}

// Asks the Designer for a different panel size; ignored outside it
export const resizePanel = (width: number, height: number): void => {
    if (inDesigner()) webflow.setExtensionSize({ width, height })
}

export type Theme = 'light' | 'dark'

// Calls `apply` with the Designer's appearance now and whenever the user
// changes it: 'light', or 'dark' for its three dark themes. Outside the
// Designer, or in one without the theme API, the panel stays dark.
export const followTheme = (apply: (theme: Theme) => void): void => {
    if (!inDesigner()) return
    const toTheme = (name: string): Theme =>
        name === 'light' ? 'light' : 'dark'
    try {
        webflow
            .getTheme()
            .then((name) => apply(toTheme(name)))
            .catch(() => {})
        webflow.subscribe('currenttheme', (name) => apply(toTheme(name)))
    } catch {
        // An older Designer without getTheme: keep the dark panel
    }
}

// The promises below last as long as the panel: assets and the folder are
// looked up once, then remembered
let folder: Promise<AssetFolder> | undefined
const assets = new Map<string, Promise<Asset>>()
let siteAssets: Promise<Map<string, Asset>> | undefined

const findFolder = async (): Promise<AssetFolder> => {
    const folders = await webflow.getAllAssetFolders()
    const names = await Promise.all(folders.map((f) => f.getName()))
    const found = folders[names.indexOf(FOLDER_NAME)]

    return found ?? webflow.createAssetFolder(FOLDER_NAME)
}

// The site's assets by name, read once, so a mark inserted in an earlier
// session is found again instead of uploaded twice
const loadSiteAssets = async (): Promise<Map<string, Asset>> => {
    const all = await webflow.getAllAssets()
    const names = await Promise.all(all.map((asset) => asset.getName()))

    return new Map(names.map((name, i) => [name, all[i]]))
}

const uploadAsset = async (mark: Mark): Promise<Asset> => {
    siteAssets ??= loadSiteAssets()
    const existing = (await siteAssets).get(mark.fileName)
    if (existing) return existing

    const file = new File([mark.svg], mark.fileName, {
        type: 'image/svg+xml',
    })
    const asset = await webflow.createAsset(file)
    await asset.setAltText(mark.name)
    try {
        folder ??= findFolder()
        await asset.setParent(await folder)
    } catch {
        // Left at the top of the assets panel, which is no reason to fail
        folder = undefined
    }

    return asset
}

const assetFor = (mark: Mark): Promise<Asset> => {
    let asset = assets.get(mark.fileName)
    if (!asset) {
        asset = uploadAsset(mark)
        // Let a failed upload be tried again next time
        asset.catch(() => assets.delete(mark.fileName))
        assets.set(mark.fileName, asset)
    }

    return asset
}

// The class that gives an inserted mark its size, created on first use and
// shared by every mark of that size, so they can be resized together
export const sizeClassName = (size: number): string => `soaring-symbols-${size}`

const sizeStyle = async (size: number): Promise<Style> => {
    const name = sizeClassName(size)
    const existing = await webflow.getStyleByName(name)
    if (existing) return existing

    const style = await webflow.createStyle(name)
    await style.setProperties({ width: `${size}px`, height: `${size}px` })

    return style
}

// What the Designer lets this user do here; a missing permission is said in
// words instead of failing halfway
const missingPermission = async (): Promise<string | undefined> => {
    const { appModes } = webflow
    const can = await webflow.canForAppMode([
        appModes.canDesign,
        appModes.canManageAssets,
        appModes.canCreateStyles,
    ])
    if (!can.canDesign) return 'Switch to Design mode to insert marks.'
    if (!can.canManageAssets) return 'You need permission to add assets.'
    if (!can.canCreateStyles) return 'You need permission to create classes.'

    return undefined
}

// Inserts a mark into the selected element, or after it when it can't hold
// children (an image, a text link). Throws when it couldn't.
export const insertMark = async (mark: Mark): Promise<void> => {
    if (!inDesigner()) {
        notify(`Open the extension in the Webflow Designer to insert marks.`)

        return
    }
    const missing = await missingPermission()
    if (missing) {
        notify(missing, 'Warning')

        return
    }
    const selected = await webflow.getSelectedElement()
    if (!selected) {
        notify('Select an element on the page to insert the mark into.', 'Info')

        return
    }

    const [asset, style] = await Promise.all([
        assetFor(mark),
        sizeStyle(mark.size),
    ])
    const preset = webflow.elementPresets.Image
    const image = selected.children
        ? await selected.append(preset)
        : await selected.after(preset)
    if (image.type !== 'Image') throw new Error('no image element was made')

    await image.setAsset(asset)
    await image.setAltText(mark.name)
    await image.setStyles([style])
    await webflow.setSelectedElement(image)
    notify(`Inserted ${mark.name}`, 'Success')
}
