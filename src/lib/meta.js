// Meta tracking helpers. The browser pixel (loaded in index.html) and the server function
// (api/meta-event.js, Conversions API) get the same event ID so Meta counts each event once.

const ENDPOINT = '/api/meta-event'

export const newEventId = () =>
  window.crypto?.randomUUID?.() || `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`

const cookie = (name) =>
  document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1)

// _fbc comes from the ad click ID; the pixel sets the cookie, this covers the first page load
function clickId() {
  const fromCookie = cookie('_fbc')
  if (fromCookie) return fromCookie
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined
}

// Server-side copy of an event. Silent on failure: tracking must never break the page.
export function sendServerEvent(eventName, { eventId, customData, user } = {}) {
  if (!window.META_PIXEL_ID) return
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // keepalive lets the request finish even if the page navigates away (e.g. to Slick-Pay)
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        fbp: cookie('_fbp'),
        fbc: clickId(),
        custom_data: customData,
        user,
      }),
    }).catch(() => {})
  } catch {
    // ignore
  }
}

// Server copy of the PageView the pixel sent from index.html. Waits a moment so the pixel
// has set its _fbp cookie, which helps Meta match the two.
export function sendServerPageView() {
  if (!window.META_PIXEL_ID || !window.META_PAGEVIEW_ID) return
  const send = () => setTimeout(() => sendServerEvent('PageView', { eventId: window.META_PAGEVIEW_ID }), 1200)
  if (document.readyState === 'complete') send()
  else window.addEventListener('load', send, { once: true })
}

// Purchase from the registration form: browser pixel + server, same event ID
export function trackPurchase({ value, category, user }) {
  const eventId = newEventId()
  const customData = {
    value,
    currency: 'DZD',
    content_name: 'دورة المدرّب المحترف 4.0 - ToT سطيف',
    content_category: category,
  }
  window.fbq?.('track', 'Purchase', customData, { eventID: eventId })
  sendServerEvent('Purchase', { eventId, customData, user })
}
