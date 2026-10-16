import { Link } from 'react-router'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found', "This page doesn't exist.")
  return (
    <>
      <h1>Off the plan.</h1>
      <p className="lede">This page doesn't exist — but I've built stranger things.</p>
      <p className="actions">
        <Link to="/">Back home</Link>
        <Link to="/work">See my work</Link>
      </p>
    </>
  )
}
