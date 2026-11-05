import { renderToStaticMarkup } from 'react-dom/server'
import Blueprint from './blueprint/Blueprint'

/** Build-time render: the full page ships as static HTML (works with JS off). */
export const render = () => renderToStaticMarkup(<Blueprint />)
