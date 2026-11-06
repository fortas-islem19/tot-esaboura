import { COURSE, FORM_ENDPOINT } from '../config'

// Readable field names, so the emails FormBold sends are easy to read
const LABELS = {
  fullName: 'الاسم الكامل',
  phone: 'رقم الهاتف (واتساب)',
  email: 'البريد الإلكتروني',
  wilaya: 'الولاية',
  profile: 'الصفة',
  experience: 'سنوات الخبرة في التدريب',
  organization: 'المؤسسة / مجال التخصص',
  topic: 'موضوع الجلسة التدريبية',
  device: 'الجهاز الذي سيحضره',
  amount: 'قيمة الدفع',
  payment: 'طريقة الدفع',
  notes: 'ملاحظات',
  consent: 'موافقة على التواصل',
}

// Sends a registration as JSON to FormBold (or VITE_FORM_ENDPOINT).
// Without an endpoint the form runs in demo mode.
export async function submitRegistration(data) {
  // Honeypot: bots fill hidden fields, people don't
  if (data.website) return

  const payload = {}
  for (const [key, label] of Object.entries(LABELS)) {
    const value = data[key]
    if (value === undefined || value === '') continue
    payload[label] = typeof value === 'boolean' ? (value ? 'نعم' : 'لا') : value
  }
  payload['الدورة'] = `${COURSE.title} — دورة تدريب المدربين ToT (${COURSE.code}) — ${COURSE.dates}، ${COURSE.city}`
  payload['تاريخ الإرسال'] = new Date().toISOString()
  payload['المصدر'] = 'صفحة دورة المدرّب المحترف 4.0 - سطيف'

  if (!FORM_ENDPOINT) {
    console.info('[demo] No form endpoint set; registration not sent:', payload)
    await new Promise((r) => setTimeout(r, 900))
    return
  }

  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
}
