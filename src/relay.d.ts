// JSX types for the Relay custom elements (plain string attributes).
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type RelayAttributes = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  source?: string
  kind?: string
  fields?: string
  whatsapp?: string
  email?: string
  topic?: string
  greeting?: string
  subject?: string
  heading?: string
  intro?: string
  label?: string
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'relay-form': RelayAttributes
      'relay-button': RelayAttributes
    }
  }
}
