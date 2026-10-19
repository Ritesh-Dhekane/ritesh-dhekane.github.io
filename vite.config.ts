import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The shared contact form (https://github.com/Ritesh-Dhekane/relay). RELAY_SRC overrides it for local testing.
const RELAY_SRC = process.env.RELAY_SRC || 'https://ritesh-dhekane.github.io/relay/v1/relay.js'

// User site (ritesh-dhekane.github.io) is served from the domain root, so base stays '/'.
export default defineConfig({
  base: '/',
  plugins: [react(), { name: 'relay-src', transformIndexHtml: (html) => html.replace('__RELAY_SRC__', RELAY_SRC) }],
})
