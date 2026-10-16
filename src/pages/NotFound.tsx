import { Link } from 'react-router'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found', "This page doesn't exist.")
  return (
    <header className="page-head" style={{ minHeight: '50vh' }}>
      <p className="label">404</p>
      <h1 className="h1">A part that doesn't fit.</h1>
      <p className="lede">This page doesn't exist — but I've built stranger things.</p>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/">
          Back home
        </Link>
        <Link className="link-arrow" to="/work">
          See the work
        </Link>
      </div>
    </header>
  )
}
