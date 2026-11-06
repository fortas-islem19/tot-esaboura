import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { submitRegistration } from '../lib/submit'
import { normalizePhone, validate } from '../lib/validate'
import { WILAYAS } from '../lib/wilayas'
import { COURSE, DEPOSIT, FULL_PRICE, OFFER, OFFER_ACTIVE, PAYMENT, PHONES, PRICE, VENUE, WHATSAPP, formatDA } from '../config'
import { Reveal } from './Motion'
import { seatsLeft } from './Sections'

const AMOUNTS = {
  deposit: { value: DEPOSIT, title: 'تسبيق 50% لتثبيت المقعد', label: `تسبيق 50% (${formatDA(DEPOSIT)})` },
  full: { value: PRICE, title: OFFER_ACTIVE ? 'كامل الرسوم بسعر العرض الخاص' : 'كامل رسوم المشاركة', label: `كامل الرسوم (${formatDA(PRICE)})` },
}
const hasLink = (amount) => Boolean(PAYMENT.slickLinks?.[amount])
const ONLINE_AVAILABLE = hasLink('deposit') || hasLink('full')

const initial = {
  fullName: '',
  phone: '',
  email: '',
  wilaya: '',
  profile: '',
  experience: '',
  organization: '',
  topic: '',
  device: '',
  amount: 'deposit',
  payment: hasLink('deposit') ? 'online' : 'transfer',
  notes: '',
  consent: false,
  website: '', // honeypot
}

const PROFILES = [
  'مدرب مبتدئ',
  'مدرب متوسط الخبرة',
  'أستاذ جامعي',
  'مكوّن في التكوين المهني',
  'مسؤول تكوين / موارد بشرية',
  'مؤطر حاضنة أو جمعية',
  'خبير تقني',
  'أخرى',
]
const EXPERIENCE = ['بدون خبرة تدريبية', 'أقل من سنتين', 'من 2 إلى 5 سنوات', 'أكثر من 5 سنوات']
const DEVICES = ['حاسوب محمول', 'هاتف ذكي فقط']
const NOTES_MAX = 500
const PAYMENT_LABEL = { online: 'دفع إلكتروني (رابط Slick-Pay)', transfer: 'تحويل CCP / بريدي موب' }

const trackPurchase = (amount, category) =>
  window.fbq?.('track', 'Purchase', {
    value: amount,
    currency: 'DZD',
    content_name: 'دورة المدرّب المحترف 4.0 - ToT سطيف',
    content_category: category,
  })

function Field({ label, name, error, required, full, hint, children }) {
  return (
    <div className={`field${full ? ' full' : ''}${error ? ' invalid' : ''}`}>
      {label && (
        <label htmlFor={name}>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.span key="err" id={`${name}-err`} className="err" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert">
            {error}
          </motion.span>
        ) : (
          hint && (
            <motion.span key="hint" className="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {hint}
            </motion.span>
          )
        )}
      </AnimatePresence>
    </div>
  )
}

function Choices({ name, options, value, onChange, error }) {
  return (
    <div className="choice-row" role="radiogroup" id={name} tabIndex={-1} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : undefined}>
      {options.map((o) => (
        <label key={o} className="choice">
          <input type="radio" name={name} value={o} checked={value === o} onChange={onChange} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  )
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked: the value stays visible to copy by hand
    }
  }
  return (
    <div className="copy-row">
      <span className="copy-label">{label}</span>
      <b dir="ltr">{value}</b>
      <button type="button" onClick={copy} aria-label={`نسخ ${label}`}>
        {copied ? 'تم النسخ ✓' : 'نسخ'}
      </button>
    </div>
  )
}

function TransferDetails({ amount }) {
  return (
    <div className="pay-details">
      <h4>للدفع عن طريق الحساب البريدي (CCP)</h4>
      <CopyRow label="رقم الحساب" value={PAYMENT.ccp.account} />
      <CopyRow label="المفتاح (Clé)" value={PAYMENT.ccp.key} />
      <CopyRow label="الاسم" value={PAYMENT.ccp.holder} />
      <h4>للدفع عن طريق بريدي موب</h4>
      <CopyRow label="RIB" value={PAYMENT.baridimobRib} />
      <p className="pay-amount">
        المبلغ: <b>{formatDA(AMOUNTS[amount].value)}</b> <small>({AMOUNTS[amount].title})</small>
      </p>
      <p className="pay-note">لا تنسَ تصوير الوصل وإرساله لنا عبر واتساب على الرقم <span dir="ltr">{WHATSAPP.display}</span> للتحقق وتأكيد مقعدك.</p>
    </div>
  )
}

function Result({ tone = 'ok', title, children, actions }) {
  const color = tone === 'ok' ? '#15803d' : '#d9741a'
  return (
    <motion.div className="success" key={title} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} role="status">
      <svg className="tick" viewBox="0 0 100 100" aria-hidden="true">
        <motion.circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        {tone === 'ok' && (
          <motion.path d="M30 52 L45 66 L71 37" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.55 }} />
        )}
      </svg>
      <h3>{title}</h3>
      <div className="result-text">{children}</div>
      {actions && <div className="result-actions">{actions}</div>}
    </motion.div>
  )
}

export default function RegisterForm() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  // idle | sending | redirecting | done | error
  const [state, setState] = useState('idle')
  // Show a field's error once it has been left, or after the first submit attempt
  const visible = (name) => (touched[name] || submitted ? errors[name] : undefined)

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    const next = { ...values, [name]: type === 'checkbox' ? checked : value }
    // Online payment needs a Slick-Pay link for the chosen amount
    if (name === 'amount' && next.payment === 'online' && !hasLink(value)) next.payment = 'transfer'
    setValues(next)
    // Radio groups and checkboxes count as touched as soon as they're picked
    if (type === 'radio' || type === 'checkbox') setTouched((t) => ({ ...t, [name]: true }))
    if (touched[name] || submitted || type === 'radio' || type === 'checkbox') setErrors(validate(next))
  }

  const onBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (state === 'sending') return
    setSubmitted(true)
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      const el = document.getElementById(first)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus({ preventScroll: true })
      return
    }
    setState('sending')
    const clean = {
      ...values,
      fullName: values.fullName.trim().replace(/\s+/g, ' '),
      email: values.email.trim().toLowerCase(),
      phone: normalizePhone(values.phone),
      organization: values.organization.trim(),
      topic: values.topic.trim(),
      amount: AMOUNTS[values.amount].label,
      payment: PAYMENT_LABEL[values.payment],
    }
    try {
      // Always record the registration first, so nobody is lost if payment fails
      await submitRegistration(clean)
    } catch (err) {
      console.error(err)
      setState('error')
      return
    }

    // Meta Pixel: Purchase once the registration is accepted (only if a pixel ID is set in index.html)
    trackPurchase(AMOUNTS[values.amount].value, values.profile)

    if (values.payment === 'online' && hasLink(values.amount)) {
      setState('redirecting')
      // Give the pixel a moment to send before leaving the page
      setTimeout(() => window.location.assign(PAYMENT.slickLinks[values.amount]), 600)
      return
    }
    setState('done')
  }

  const reset = () => {
    setValues(initial)
    setErrors({})
    setTouched({})
    setSubmitted(false)
    setState('idle')
  }

  const firstName = values.fullName.trim().split(' ')[0]
  const amountDA = formatDA(AMOUNTS[values.amount].value)
  const aria = (name) => ({ 'aria-invalid': !!visible(name), 'aria-describedby': visible(name) ? `${name}-err` : undefined })

  const methods = [
    ['online', 'الدفع الإلكتروني', 'بطاقة CIB أو الذهبية، عبر رابط Slick-Pay', hasLink(values.amount)],
    ['transfer', 'الدفع عبر البريد', 'تحويل إلى حساب CCP أو بريدي موب', true],
  ].filter(([val]) => val !== 'online' || ONLINE_AVAILABLE)

  return (
    <section className="sec sec-form" id="register">
      <div className="wrap narrow">
        <Reveal className="sec-title">
          <span className="kicker">التسجيل</span>
          <h2>احجز مقعدك في الدورة</h2>
          <p>
            {OFFER_ACTIVE && (
              <>
                سعر خاص <b>{formatDA(PRICE)}</b> بدل {formatDA(FULL_PRICE)} {OFFER.label} فقط.{' '}
              </>
            )}
            املأ الاستمارة في دقيقتين، ثم ثبّت مقعدك بدفع التسبيق ({formatDA(DEPOSIT)}) أو كامل الرسوم ({formatDA(PRICE)}). المقاعد محدودة بـ {COURSE.seats} مشاركًا،
            والأولوية حسب ترتيب التسجيل.
          </p>
        </Reveal>

        <Reveal className="form-box">
          <div className="form-summary">
            <span>
              <b>{COURSE.dates}</b>
            </span>
            <span>
              {VENUE.name}، {VENUE.city}
            </span>
            {OFFER_ACTIVE ? (
              <span>
                <b>{formatDA(PRICE)}</b> {OFFER.label}
              </span>
            ) : (
              <span>
                بقي <b>{seatsLeft}</b> مقعدًا
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <Result
                title={`شكرًا ${firstName}، تم تسجيلك!`}
                actions={
                  <>
                    <a
                      href={`https://wa.me/${WHATSAPP.wa}?text=${encodeURIComponent(`السلام عليكم، هذا وصل الدفع (${amountDA}) لدورة المدرّب المحترف 4.0 (ToT سطيف) باسم ${values.fullName.trim()}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-green"
                    >
                      أرسل الوصل عبر واتساب
                    </a>
                    <button type="button" className="btn btn-soft" onClick={reset}>
                      تسجيل شخص آخر
                    </button>
                  </>
                }
              >
                <p>بقيت خطوة واحدة لتأكيد مقعدك: ادفع {amountDA} بإحدى الطريقتين، ثم أرسل لنا صورة الوصل.</p>
                <TransferDetails amount={values.amount} />
              </Result>
            ) : state === 'redirecting' ? (
              <Result tone="wait" title="تم تسجيلك، جارٍ تحويلك إلى صفحة الدفع..." actions={<a href={PAYMENT.slickLinks[values.amount]} className="btn btn-orange">افتح صفحة الدفع</a>}>
                <p>ستنتقل الآن إلى صفحة Slick-Pay لإتمام الدفع ببطاقة CIB أو الذهبية. إذا لم تنتقل تلقائيًا، اضغط على الزر.</p>
              </Result>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -20 }} aria-label="استمارة التسجيل في دورة المدرّب المحترف 4.0">
                <fieldset>
                  <legend>
                    <span>1</span> معلوماتك
                  </legend>
                  <div className="form-grid">
                    <Field label="الاسم واللقب" name="fullName" error={visible('fullName')} required full>
                      <input id="fullName" name="fullName" value={values.fullName} onChange={onChange} onBlur={onBlur} autoComplete="name" maxLength={60} placeholder="مثال: أمينة بن علي" {...aria('fullName')} />
                    </Field>
                    <Field label="رقم الهاتف (واتساب)" name="phone" error={visible('phone')} required>
                      <input id="phone" name="phone" type="tel" inputMode="tel" dir="ltr" value={values.phone} onChange={onChange} onBlur={onBlur} autoComplete="tel" maxLength={18} placeholder="0661 23 45 67" {...aria('phone')} />
                    </Field>
                    <Field label="البريد الإلكتروني" name="email" error={visible('email')} required hint="نرسل عليه روابط المنصة القبلية والبعدية">
                      <input id="email" name="email" type="email" dir="ltr" value={values.email} onChange={onChange} onBlur={onBlur} autoComplete="email" maxLength={80} placeholder="name@gmail.com" {...aria('email')} />
                    </Field>
                    <Field label="الولاية" name="wilaya" error={visible('wilaya')} required full>
                      <select id="wilaya" name="wilaya" value={values.wilaya} onChange={onChange} onBlur={onBlur} {...aria('wilaya')}>
                        <option value="">اختر ولايتك</option>
                        {WILAYAS.map((w, i) => (
                          <option key={w} value={w}>
                            {String(i + 1).padStart(2, '0')} - {w}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>
                    <span>2</span> ملفك التدريبي
                  </legend>
                  <div className="form-grid">
                    <Field label="الصفة" name="profile" error={visible('profile')} required full>
                      <Choices name="profile" options={PROFILES} value={values.profile} onChange={onChange} error={visible('profile')} />
                    </Field>
                    <Field label="خبرتك في التدريب أو التدريس" name="experience" error={visible('experience')} required full>
                      <Choices name="experience" options={EXPERIENCE} value={values.experience} onChange={onChange} error={visible('experience')} />
                    </Field>
                    <Field label="المؤسسة أو مجال التخصص" name="organization" error={visible('organization')} full>
                      <input id="organization" name="organization" value={values.organization} onChange={onChange} onBlur={onBlur} maxLength={120} placeholder="مثال: جامعة سطيف 1، الإعلام الآلي" {...aria('organization')} />
                    </Field>
                    <Field label="موضوع الجلسة التدريبية التي ستشتغل عليها (اختياري)" name="topic" error={visible('topic')} full hint="يمكنك تحديده لاحقًا خلال المرحلة القبلية">
                      <input id="topic" name="topic" value={values.topic} onChange={onChange} onBlur={onBlur} maxLength={200} placeholder="مثال: التواصل الفعّال مع الزبائن" {...aria('topic')} />
                    </Field>
                    <Field label="ماذا ستُحضر معك؟" name="device" error={visible('device')} required full>
                      <Choices name="device" options={DEVICES} value={values.device} onChange={onChange} error={visible('device')} />
                    </Field>
                  </div>
                </fieldset>

                <fieldset>
                  <legend>
                    <span>3</span> الدفع والتأكيد
                  </legend>
                  <div className="form-grid">
                    <Field label="المبلغ الذي ستدفعه الآن" name="amount" error={visible('amount')} required full>
                      <div className="pay-options" role="radiogroup" id="amount">
                        {Object.entries(AMOUNTS).map(([val, a]) => (
                          <label key={val} className={`pay-option${values.amount === val ? ' on' : ''}`}>
                            <input type="radio" name="amount" value={val} checked={values.amount === val} onChange={onChange} />
                            <span>
                              <b>{formatDA(a.value)}</b>
                              <small>{a.title}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                    </Field>

                    <Field label="طريقة الدفع" name="payment" required full>
                      <div className="pay-options" role="radiogroup" id="payment">
                        {methods.map(([val, title, sub, enabled]) => (
                          <label key={val} className={`pay-option${values.payment === val ? ' on' : ''}${enabled ? '' : ' off'}`}>
                            <input type="radio" name="payment" value={val} checked={values.payment === val} onChange={onChange} disabled={!enabled} />
                            <span>
                              <b>{title}</b>
                              <small>{enabled ? sub : 'غير متاح لهذا المبلغ، اختر التحويل البريدي'}</small>
                            </span>
                          </label>
                        ))}
                      </div>
                      {values.payment === 'transfer' && <TransferDetails amount={values.amount} />}
                    </Field>

                    <Field label="ملاحظات أو أسئلة (اختياري)" name="notes" error={visible('notes')} full hint={`${values.notes.length} / ${NOTES_MAX} حرف`}>
                      <textarea id="notes" name="notes" value={values.notes} onChange={onChange} onBlur={onBlur} maxLength={NOTES_MAX} placeholder="اكتب أي سؤال تريد طرحه" {...aria('notes')} />
                    </Field>

                    {/* Honeypot: hidden from people, bots fill it in */}
                    <input type="text" name="website" value={values.website} onChange={onChange} tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

                    <Field label="" name="consent" error={visible('consent')} full>
                      <label className="consent">
                        <input id="consent" name="consent" type="checkbox" checked={values.consent} onChange={onChange} {...aria('consent')} />
                        <span>أوافق على أن يتصل بي فريق المعهد إنترناشيونال والسبورة بخصوص الدورة</span>
                      </label>
                    </Field>
                  </div>
                </fieldset>

                {submitted && Object.keys(errors).length > 0 && (
                  <div className="form-error" role="alert">
                    يرجى تصحيح الحقول المشار إليها باللون الأحمر ({Object.keys(errors).length}).
                  </div>
                )}
                {state === 'error' && (
                  <div className="form-error" role="alert">
                    تعذّر إرسال الطلب. حاول مرة أخرى أو اتصل بنا على <span dir="ltr">{PHONES[0].display}</span>.
                  </div>
                )}

                <button type="submit" className="btn btn-orange btn-lg btn-block" disabled={state === 'sending'}>
                  {state === 'sending' ? (
                    <>
                      <span className="spinner" /> جارٍ الإرسال...
                    </>
                  ) : values.payment === 'online' ? (
                    `سجّل وانتقل إلى الدفع (${amountDA})`
                  ) : (
                    'أرسل طلب التسجيل'
                  )}
                </button>
                <p className="secure">بياناتك تُستعمل فقط للتواصل معك بخصوص هذه الدورة.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
