import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Vite dev plugin: napodobuje Vercel-style serverless funkce.
// Bere POST /api/<jmeno> a volá default export ze souboru api/<jmeno>.js.
// V produkci na Vercel funkce běží nativně, tohle je jen pro `npm run dev`.
function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const name = req.url.split('?')[0].slice('/api/'.length)
        if (!/^[a-zA-Z0-9_-]+$/.test(name)) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          const handler = mod.default
          if (typeof handler !== 'function') return next()

          // Parse JSON body
          let body = ''
          for await (const chunk of req) body += chunk
          try {
            req.body = body ? JSON.parse(body) : {}
          } catch {
            req.body = body
          }

          // Minimalistický shim pro Vercel/Node `res`
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return res
          }

          await handler(req, res)
        } catch (err) {
          console.error('[api-dev] handler error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Načti .env.local pro dev tak, aby serverless handler viděl SMTP_* proměnné
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [react(), apiDevPlugin()],
  }
})
