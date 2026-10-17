import { useState } from 'react'
import { Link } from 'react-router'
import { findProject, profile } from '../lib/content'
import { track } from '../lib/analytics'

/** "What brings you here?" — one line per audience, with the projects that matter to them. Hidden on Home for now. */
export default function IntentPicker() {
  const [intentId, setIntentId] = useState(profile.intents[0].id)
  const intent = profile.intents.find((i) => i.id === intentId) ?? profile.intents[0]
  return (
    <div className="intent reveal" aria-labelledby="intent-title">
        <p id="intent-title" className="label" style={{ gridColumn: 'auto' }}>
          What brings you here?
        </p>
        <div className="chips" role="radiogroup" aria-labelledby="intent-title">
          {profile.intents.map((i) => (
            <button
              key={i.id}
              type="button"
              className="chip"
              role="radio"
              aria-checked={i.id === intentId}
              onClick={() => {
                setIntentId(i.id)
                track({ name: 'intent_select', params: { intent: i.id } })
              }}
            >
              {i.label}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          {intent.message}{' '}
          {intent.highlight.map((slug, n) => {
            const p = findProject(slug)
            return p ? (
              <span key={slug}>
                {n > 0 && ' · '}
                <Link to={p.page ? `/work/${slug}` : `/work#${slug}`}>{p.title}</Link>
              </span>
            ) : null
          })}
        </p>
      </div>
  )
}
