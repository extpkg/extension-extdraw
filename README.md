# TLDraw Extension

---

Steps to re-create this extension:

1. Find and download tldraw-nextjs-example from https://github.com/tldraw/examples
2. Run npm install to install dependencies
3. Add output: 'export' to next.config.js to allow exporting to static files
4. Add assetPrefix: './' to next.config.js to allow loading assets from a relative path
5. Add * { box-sizing: border-box; } to globals.css
6. Add persistenceKey='ext' to Editor component to make tldraw save drawings to storage
7. Run npm run build and copy the contents of the out directory to the extension
8. Extension manifest, code & zip file to load the index.html
