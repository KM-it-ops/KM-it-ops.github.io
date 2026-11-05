// Injects the static render of <Blueprint/> into docs/index.html after `vite build`.
import { readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const file = 'docs/index.html'
  const html = readFileSync(file, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error('root placeholder not found')
  writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
  console.log('prerendered docs/index.html')
} finally {
  await vite.close()
}
