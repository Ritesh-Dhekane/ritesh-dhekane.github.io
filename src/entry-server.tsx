import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import App from './App'

/**
 * Build-time pre-rendering (see scripts/postbuild.mjs): renders one URL of the site to HTML so search
 * engines and link previews get the real content, not an empty <div id="root">. `prerender` waits for
 * lazy pages (the case studies) before returning.
 */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}

export { jsonLdFor, metaFor, pagePaths, SITE, VERIFICATION } from './lib/seo'
