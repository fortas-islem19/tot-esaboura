// Vercel serverless function: forwards page events to the Meta Conversions API.
//
// The browser pixel (index.html) sends the same events with the same event ID, so Meta
// deduplicates them and counts each one once. The access token never reaches the browser:
// it lives in the Vercel environment variable META_CAPI_TOKEN.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   META_CAPI_TOKEN        required, Conversions API access token
//   META_PIXEL_ID          optional, defaults to the page's pixel
//   META_GRAPH_VERSION     optional, Graph API version (default v23.0)
//   META_TEST_EVENT_CODE   optional, shows server events under Events Manager → Test events
import { createHash } from 'node:crypto'

const PIXEL_ID = process.env.META_PIXEL_ID || '1119345057627502'
const VERSION = process.env.META_GRAPH_VERSION || 'v23.0'
const ALLOWED_EVENTS = new Set(['PageView', 'Purchase'])

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const clean = (value) => String(value ?? '').trim().toLowerCase()

// Algerian mobile written 0XXXXXXXXX → 213XXXXXXXXX, digits only, as Meta expects
function normalizePhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('00213')) return digits.slice(2)
  if (digits.startsWith('213')) return digits
  if (digits.startsWith('0')) return `213${digits.slice(1)}`
  return digits
}

// Only accept events posted by this site's own pages
function sameOrigin(req) {
  const source = req.headers.origin || req.headers.referer
  const host = req.headers['x-forwarded-host'] || req.headers.host
  if (!source || !host) return false
  try {
    return new URL(source).host === host
  } catch {
    return false
  }
}

function userData(req, body) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  const data = {
    client_ip_address: forwarded || req.socket?.remoteAddress || undefined,
    client_user_agent: req.headers['user-agent'] || undefined,
    fbp: typeof body.fbp === 'string' ? body.fbp.slice(0, 200) : undefined,
    fbc: typeof body.fbc === 'string' ? body.fbc.slice(0, 500) : undefined,
    country: [sha256('dz')],
  }
  const user = body.user || {}
  const email = clean(user.email)
  if (email.includes('@')) data.em = [sha256(email)]
  const phone = normalizePhone(user.phone)
  if (phone) data.ph = [sha256(phone)]
  const names = clean(user.fullName).replace(/[^\p{L}\s]/gu, '').split(/\s+/).filter(Boolean)
  if (names.length) data.fn = [sha256(names[0])]
  if (names.length > 1) data.ln = [sha256(names.slice(1).join(' '))]
  return data
}

function customData(body) {
  const c = body.custom_data || {}
  const out = {}
  const value = Number(c.value)
  if (Number.isFinite(value) && value > 0) out.value = value
  if (typeof c.currency === 'string') out.currency = c.currency.slice(0, 3).toUpperCase()
  if (typeof c.content_name === 'string') out.content_name = c.content_name.slice(0, 200)
  if (typeof c.content_category === 'string') out.content_category = c.content_category.slice(0, 200)
  return out
}

export default async function handler(req, res) {
  const token = process.env.META_CAPI_TOKEN

  // Health check that never reveals the token
  if (req.method === 'GET') return res.status(200).json({ ok: true, configured: Boolean(token) })
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  if (!token) return res.status(503).json({ error: 'not_configured' })
  if (!sameOrigin(req)) return res.status(403).json({ error: 'forbidden' })

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }
  if (!body || !ALLOWED_EVENTS.has(body.event_name)) return res.status(400).json({ error: 'bad_event' })

  const event = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: typeof body.event_id === 'string' ? body.event_id.slice(0, 100) : undefined,
    event_source_url: typeof body.event_source_url === 'string' ? body.event_source_url.slice(0, 1000) : undefined,
    action_source: 'website',
    user_data: userData(req, body),
  }
  if (body.event_name === 'Purchase') event.custom_data = customData(body)

  const payload = { data: [event], access_token: token }
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE

  try {
    const response = await fetch(`https://graph.facebook.com/${VERSION}/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      console.error('Meta CAPI error', response.status, result?.error?.message)
      return res.status(502).json({ error: 'meta_error', status: response.status })
    }
    return res.status(200).json({ ok: true, events_received: result.events_received })
  } catch (err) {
    console.error('Meta CAPI request failed', err?.message)
    return res.status(502).json({ error: 'meta_unreachable' })
  }
}
