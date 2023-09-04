import React from 'react'
import ReactDOM from 'react-dom/client'
import Editor from './Editor'
import './index.css'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Editor></Editor>
    </React.StrictMode>
  )
}
