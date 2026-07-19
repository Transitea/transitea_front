import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

// localhost est un contexte sécurisé même en HTTP (getUserMedia y fonctionne déjà) :
// HTTPS n'est nécessaire que pour tester le scan QR depuis un smartphone via l'IP du LAN.
// Activé uniquement par `npm run dev:phone` (variable HTTPS=true), pour ne pas gêner le dev habituel.
const httpsActif = process.env.HTTPS === 'true'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ...(command === 'serve' && httpsActif ? [basicSsl()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-icon.svg'],
      manifest: {
        name: 'Transitea — Suivi de colis',
        short_name: 'Transitea',
        description: 'Suivi de colis hors-ligne : expéditions, notifications WhatsApp et synchronisation.',
        lang: 'fr',
        theme_color: '#1E3A5F',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-icon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: httpsActif, // n'expose sur le LAN que lorsque HTTPS est actif (dev:phone)
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}))
