/** A screenshot in a quiet browser window, like a product shot. */
export default function BrowserFrame({ src, alt, eager }: { src: string; alt: string; eager?: boolean }) {
  return (
    <figure className="browser">
      <div className="browser-bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <img src={src} alt={alt} width="1200" height="750" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  )
}
