import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { initAnalytics } from './lib/analytics'
import './styles.css'

initAnalytics()

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
const root = document.getElementById('root')!
// Known pages arrive pre-rendered (scripts/postbuild.mjs) and are hydrated; 404.html has an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
