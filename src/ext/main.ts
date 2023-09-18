// TLDraw EXT extension

// Entry type
interface Entry {
  window: ext.windows.Window
  tab: ext.tabs.Tab
  websession: ext.websessions.Websession
  webview: ext.webviews.Webview
  partition: number
}

// Global resources
const entries: Entry[] = []

// Extension clicked
ext.runtime.onExtensionClick.addListener(async () => {

  // Objects to create
  let webview: ext.webviews.Webview | null = null
  let websession: ext.websessions.Websession | null = null
  let window: ext.windows.Window | null = null
  let tab: ext.tabs.Tab | null = null
  
  try {
    
    // Get websession partition
    let partition = 1
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].partition == partition) {
        partition++
        i = 0
      }
    }

    // Create window
    const darkMode = await ext.windows.getPlatformDarkMode()
    const icon = darkMode ? 'icons/icon-128-dark.png' : 'icons/icon-128.png'
    window = await ext.windows.create({
      title: 'TLDraw - #' + partition,
      icon: icon,
      fullscreenable: true,
      vibrancy: false,
      frame: true,
    })

    // Create tab
    tab = await ext.tabs.create({
      icon: 'icons/icon-128.png',
      icon_dark: 'icons/icon-128-dark.png',
      text: 'TLDraw - #' + partition,
      mutable: false,
      closable: true,
    })

    // Check if persistent permission is granted
    const permissions = await ext.runtime.getPermissions()
    const persistent = (permissions['websessions'] ?? {})['create.persistent']?.granted ?? false

    // Create websession
    websession = await ext.websessions.create({
      partition: partition.toString(),
      persistent: persistent,
      global: false,
    })

    // Create webview
    webview = await ext.webviews.create({ websession: websession })
    const size = await ext.windows.getContentSize(window.id)
    await ext.webviews.attach(webview.id, window.id)
    await ext.webviews.setBounds(webview.id, { x: 0, y: 0, width: size.width, height: size.height })
    await ext.webviews.setAutoResize(webview.id, { width: true, height: true })
    await ext.webviews.loadFile(webview.id, 'tldraw/index.html')
    
    // Save entry
    entries.push({
      window: window,
      tab: tab,
      websession: websession,
      webview: webview,
      partition: partition,
    })

  } catch (error) {

    // Print error
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error))

    // Delete objects
    if (window) await ext.windows.remove(window.id)
    if (tab) await ext.tabs.remove(tab.id)
    if (websession) await ext.websessions.remove(websession.id)
    if (webview) await ext.webviews.remove(webview.id)

  }
})

// Get and optionally remove entry from tab id
function getEntryFromTabId(id: string, remove: boolean): Entry | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry.tab.id == id) {
      if (remove) entries.splice(i, 1)
      return entry
    }
  }
  return null
}

// Get and optionally remove entry from window id
function getEntryFromWindowId(id: string, remove: boolean): Entry | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry.window.id == id) {
      if (remove) entries.splice(i, 1)
      return entry
    }
  }
  return null
}

// Remove entry objects
async function removeEntry(entry: Entry): Promise<void> {
  await ext.windows.remove(entry.window.id)
  await ext.tabs.remove(entry.tab.id)
  await ext.websessions.remove(entry.websession.id)
  await ext.webviews.remove(entry.webview.id)
}

// Dark mode was updated
ext.windows.onUpdatedDarkMode.addListener(async (_event, details) => {
  const icon = details.enabled ? 'icons/icon-128-dark.png' : 'icons/icon-128.png'
  for (const entry of entries) {
    await ext.windows.update(entry.window.id, {
      icon: icon
    })
  }
})

// Tab was removed by another extension
ext.tabs.onRemoved.addListener(async (event) => {
  try {

    // Find and remove entry
    const entry = getEntryFromTabId(event.id, true)
    if (entry !== null) await removeEntry(entry)
    
  } catch (error) {

    // Print error
    console.error('ext.tabs.onRemoved', JSON.stringify(error))

  }
})

// Tab was clicked
ext.tabs.onClicked.addListener(async (event) => {
  try {

    // Remove entry
    const entry = getEntryFromTabId(event.id, false)
    if (entry === null) return

    // Restore and focus window
    await ext.windows.restore(entry.window.id)
    await ext.windows.focus(entry.window.id)

  } catch (error) {

    // Print error
    console.error('ext.tabs.onClicked', JSON.stringify(error))

  }
})

// Tab was closed
ext.tabs.onClickedClose.addListener(async (event) => {
  try {

    // Remove entry
    const entry = getEntryFromTabId(event.id, true)
    if (entry !== null) await removeEntry(entry)

  } catch (error) {

    // Print error
    console.error('ext.tabs.onClickedClose', JSON.stringify(error))

  }
})

// Window was removed by another extension
ext.windows.onRemoved.addListener(async (event) => {
  try {

    // Remove entry
    const entry = getEntryFromWindowId(event.id, true)
    if (entry !== null) await removeEntry(entry)

  } catch (error) {

    // Print error
    console.error('ext.windows.onRemoved', JSON.stringify(error))

  }
})

// Window was closed
ext.windows.onClosed.addListener(async (event) => {
  try {

    // Remove entry
    const entry = getEntryFromWindowId(event.id, true)
    if (entry !== null) await removeEntry(entry)

  } catch (error) {

    // Print error
    console.error('ext.windows.onClosed', JSON.stringify(error))

  }
})
