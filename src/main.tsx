import './blueprint/blueprint.css'
import { enhance } from './blueprint/enhance'

/**
 * Production: index.html already contains the prerendered sheet set (scripts/prerender.mjs),
 * so we only enhance it. Dev server: render it first, then enhance.
 */
async function boot() {
  const root = document.getElementById('root')!
  if (!root.firstElementChild) {
    const [{ createRoot }, { flushSync }, { default: Blueprint }, { createElement }] = await Promise.all([
      import('react-dom/client'),
      import('react-dom'),
      import('./blueprint/Blueprint'),
      import('react'),
    ])
    flushSync(() => createRoot(root).render(createElement(Blueprint)))
  }
  enhance()
}
void boot()
