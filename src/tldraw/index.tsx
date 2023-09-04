import React from 'react'
import ReactDOM from 'react-dom/client'
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import { Tldraw } from '@tldraw/tldraw'
import './index.css'

const assetUrls = getAssetUrlsByMetaUrl(url => url)
const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div className="tldraw__editor">
        <Tldraw autoFocus persistenceKey='ext' assetUrls={assetUrls} onMount={editor => {
          const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          editor.user.updateUserPreferences({ isDarkMode: dark })
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            editor.user.updateUserPreferences({ isDarkMode: event.matches })
          })
        }}/>
      </div>
    </React.StrictMode>
  )
}
