import { useEffect } from 'react'
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import { Tldraw, useEditor } from '@tldraw/tldraw'

function Inner() {

  // Get tldraw editor
  const editor = useEditor()

  // Load dark mode initially
  useEffect(() => {
    const load = async function() {
      try {
        const dark = await ext.windows.getPlatformDarkMode()
        editor.user.updateUserPreferences({ isDarkMode: dark })
      } catch (error) {
        console.error(error)
      }
    }
    load()
  }, [])

  // Register for dark mode updates
  useEffect(() => {
    try {
      const onUpdate = (_event: ext.windows.WindowEvent, details: ext.windows.EventDarkMode) => {
        editor.user.updateUserPreferences({ isDarkMode: details.enabled })
      }
      ext.windows.onUpdatedDarkMode.addListener(onUpdate)
      return () => ext.windows.onUpdatedDarkMode.removeListener(onUpdate)
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Empty component
  return null

}

export default function Editor() {

  // Get tldraw assets
  const assetUrls = getAssetUrlsByMetaUrl((url: string) => url)
  
  // Render
  return (
    <div className="tldraw__editor">
      <Tldraw autoFocus persistenceKey='ext' assetUrls={assetUrls} >
        <Inner />
      </Tldraw>
    </div>
  )

}
