import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import almaahedLogo from '../assets/almaahed.png'
import esabouraMark from '../assets/esaboura-mark.png'
import esabouraFull from '../assets/esaboura-full.png'
import { ALUMNI, COURSE, DEPOSIT, EARLY, EARLY_ACTIVE, FULL_PRICE, PHONES, PRICE, SEATS_TAKEN, SHOW_TECH_CARD, SITES, VENUE, WHATSAPP, formatDA, remainderFor } from '../config'
import {
  ASSESSMENT, AUDIENCE, CO_TRAINERS, CONTEXT, CONTEXT_INTRO, DAYS, FAQ, FEES_INCLUDE, GOAL, IMPACT_LEVELS, KIT_PRODUCE, KIT_RECEIVE,
  LEAD_TRAINER, LOGISTICS, OUTCOMES, POST_PHASE, PREREQS, STATS, TECHNIQUES, TOOLS,
} from '../data'
import {
  ArrowIcon, AwardIcon, BookIcon, BrainIcon, BriefcaseIcon, CalendarIcon, ChartIcon, CheckIcon, ClockIcon, GameIcon, LaptopIcon, LayersIcon,
  MapIcon, MicIcon, MonitorIcon, PhoneIcon, PinIcon, RepeatIcon, ShieldIcon, SparkIcon, TargetIcon, UsersIcon, VideoIcon, WhatsAppIcon,
} from './Icons'
import { Reveal } from './Motion'

const BASE = import.meta.env.BASE_URL
export const PDF_URL = `${BASE}fiche-technique-tot-pro-26.pdf`
export const seatsLeft = Math.max(COURSE.seats - SEATS_TAKEN, 0)

function SectionTitle({ kicker, title, text, light, center = true }) {
  return (
    <Reveal className={`sec-title${light ? ' light' : ''}${center ? '' : ' start'}`}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  )
}

// Trainer photo, with the trainer's initials when the photo file isn't there yet
export function Avatar({ src, initials, alt, className = '' }) {
  const [ok, setOk] = useState(Boolean(src))
  return (
    <span className={`avatar ${className}`}>
      {ok ? <img src={`${BASE}${src}`} alt={alt} loading="lazy" onError={() => setOk(false)} /> : <span className="avatar-initials" aria-label={alt}>{initials}</span>}
    </span>
  )
}

function Logos({ small }) {
  return (
    <span className={`logos${small ? ' small' : ''}`}>
      <img src={almaahedLogo} alt="Almaahed International — المعهد إنترناشيونال" className="logo-almaahed" />
      <span className="x" aria-hidden="true">
        ×
      </span>
      <img src={esabouraMark} alt="e-Saboura — السبورة" className="logo-esaboura" />
    </span>
  )
}

/* ---------- Announcement + header ---------- */
const NAV = [
  ['#outcomes', 'الكفاءات'],
  ['#program', 'البرنامج'],
  ['#trainers', 'المدربون'],
  ['#certification', 'الإشهاد'],
  ['#pricing', 'الرسوم'],
  ['#faq', 'أسئلة'],
]

export function Header() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 10)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div className="announce">
        <div className="wrap announce-inner">
          <span className="dot" aria-hidden="true" />
          {EARLY_ACTIVE ? (
            <span>
              {EARLY.label}: <b>{formatDA(EARLY.price)}</b> بدل <s>{formatDA(EARLY.was)}</s> · مشاركو منصة السبورة: + {ALUMNI.gift}
            </span>
          ) : (
            <span>
              {COURSE.dates} · مشاركو منصة السبورة: <b>{formatDA(ALUMNI.price)}</b> + {ALUMNI.gift}
            </span>
          )}
        </div>
      </div>
      <header className={`top${solid ? ' solid' : ''}`}>
        <div className="wrap top-inner">
          <a href="#top" aria-label="المدرّب المحترف 4.0 — العودة إلى الأعلى">
            <Logos small />
          </a>
          <nav className="top-nav" aria-label="أقسام الصفحة">
            {NAV.map(([h, l]) => (
              <a key={h} href={h}>
                {l}
              </a>
            ))}
          </nav>
          <a href="#register" className="btn btn-orange btn-sm">
            سجّل الآن
          </a>
        </div>
      </header>
    </>
  )
}

/* ---------- Hero ---------- */
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const split = (diff) => ({
  over: diff <= 0,
  d: Math.floor(diff / 864e5),
  h: Math.floor((diff % 864e5) / 36e5),
  m: Math.floor((diff % 36e5) / 6e4),
  s: Math.floor((diff % 6e4) / 1e3),
})

// Counts down to the end of early registration while it runs, then to the first day of the course
function Countdown() {
  const now = useNow()
  const earlyLeft = new Date(EARLY.endsAt).getTime() - now
  const showEarly = EARLY_ACTIVE && earlyLeft > 0
  const { over, d, h, m, s } = split(showEarly ? earlyLeft : new Date(COURSE.startsAt).getTime() - now)
  if (over) return null
  const label = showEarly ? 'ينتهي سعر التسجيل المبكر بعد' : 'تبدأ الدورة بعد'
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <>
      <p className="cd-title">{label}</p>
      <div className="countdown" role="timer" aria-label={`${label} ${d} يومًا و${h} ساعة`}>
        {[
          [d, 'يوم'],
          [pad(h), 'ساعة'],
          [pad(m), 'دقيقة'],
          [pad(s), 'ثانية'],
        ].map(([v, l]) => (
          <span key={l} className="cd-box">
            <b>{v}</b>
            <small>{l}</small>
          </span>
        ))}
      </div>
    </>
  )
}

export function Hero() {
  const facts = [
    [CalendarIcon, 'التاريخ', `${COURSE.dates} (${COURSE.days} أيام)`],
    [ClockIcon, 'المدة', `${COURSE.totalHours} ساعة حضورية · ${COURSE.hours}`],
    [PinIcon, 'المكان', `${VENUE.name}، ${VENUE.city}`],
    [AwardIcon, 'الإشهاد', 'شهادتان: المعهد إنترناشيونال والسبورة'],
  ]
  const up = (delay) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay, ease: 'easeOut' } })
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="eyebrow" {...up(0)} dir="ltr">
            <span className="pulse" aria-hidden="true" />
            {COURSE.english}
          </motion.span>
          <motion.h1 {...up(0.08)}>
            {COURSE.title.replace(' 4.0', '')} <span className="v">4.0</span>
          </motion.h1>
          <motion.p className="hero-sub" {...up(0.16)}>
            {COURSE.subtitle}
          </motion.p>
          <motion.p className="hero-lead" {...up(0.24)}>
            دورة تطبيقية مكثفة تُكوّن مدربين قادرين على تصميم تجارب تعلّم فعّالة وتيسيرها حضوريًا وعن بُعد، وقياس أثرها، باعتماد علوم الدماغ والتصميم
            المعكوس والتلعيب والذكاء الاصطناعي.
          </motion.p>
          <motion.div className="hero-cta" {...up(0.32)}>
            <a href="#register" className="btn btn-orange btn-lg">
              احجز مقعدك الآن
              <ArrowIcon width={20} height={20} />
            </a>
            {SHOW_TECH_CARD ? (
              <a href={PDF_URL} className="btn btn-ghost btn-lg" target="_blank" rel="noopener">
                البطاقة التقنية (PDF)
              </a>
            ) : (
              <a href="#program" className="btn btn-ghost btn-lg">
                البرنامج التفصيلي
              </a>
            )}
          </motion.div>
          <motion.div className="lead-chip" {...up(0.4)}>
            <Avatar src={LEAD_TRAINER.photo} initials={LEAD_TRAINER.initials} alt={LEAD_TRAINER.name} />
            <div>
              <small>بقيادة</small>
              <b>{LEAD_TRAINER.name}</b>
              <span>
                {LEAD_TRAINER.award} · متحدّث TEDx
              </span>
            </div>
          </motion.div>
        </div>

        <motion.aside className="event-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} aria-label="ملخص الدورة">
          <div className="event-head">
            <span className="code" dir="ltr">
              {COURSE.code}
            </span>
            <span className="seats-pill">
              <UsersIcon width={16} height={16} /> {seatsLeft} مقعدًا متبقيًا
            </span>
          </div>
          <Countdown />
          <ul className="event-facts">
            {facts.map(([Icon, label, value]) => (
              <li key={label}>
                <span className="ef-ico">
                  <Icon width={20} height={20} />
                </span>
                <div>
                  <small>{label}</small>
                  <b>{value}</b>
                </div>
              </li>
            ))}
          </ul>
          <div className="event-price">
            {EARLY_ACTIVE && <span className="offer-badge">التسجيل المبكر {EARLY.label}</span>}
            <div>
              <small>{EARLY_ACTIVE ? `السعر الكلي ${formatDA(FULL_PRICE)}` : 'رسوم المشاركة'}</small>
              <span className="price-pair">
                {EARLY_ACTIVE && <s className="old">{formatDA(EARLY.was)}</s>}
                <b>{formatDA(PRICE)}</b>
              </span>
            </div>
            <p>
              يُثبَّت المقعد بتسبيق <b>{formatDA(DEPOSIT)}</b>، والباقي نقدًا
            </p>
            <p className="alumni-line">
              شاركت في منصة السبورة؟ <b>{formatDA(ALUMNI.price)}</b> + {ALUMNI.gift}
            </p>
          </div>
          <a href="#register" className="btn btn-orange btn-block">
            سجّل الآن وثبّت مقعدك
          </a>
        </motion.aside>
      </div>

      <div className="wrap">
        <motion.div className="partners" {...up(0.5)}>
          <span>تنظيم مشترك</span>
          <Logos />
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Stats + marquee ---------- */
export function Stats() {
  return (
    <section className="stats-sec" aria-label="الدورة بالأرقام">
      <div className="wrap">
        <ul className="stats">
          {STATS.map(([n, l, sub], i) => (
            <Reveal as="li" key={l} delay={i * 0.05}>
              <b dir="ltr">{n}</b>
              <span>{l}</span>
              <small>{sub}</small>
            </Reveal>
          ))}
        </ul>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...TOOLS, ...TOOLS].map((t, i) => (
            <span key={i} dir="ltr">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Why ---------- */
const CONTEXT_ICONS = [RepeatIcon, BrainIcon, SparkIcon, ChartIcon]

export function Why() {
  return (
    <section className="sec" id="why">
      <div className="wrap why-grid">
        <Reveal className="why-intro">
          <span className="kicker">لماذا هذه الدورة الآن؟</span>
          <h2>
            من <s>الملقّن</s> إلى <span className="hl">مهندس تجربة التعلّم</span>
          </h2>
          <p>{CONTEXT_INTRO}</p>
          <a href="#program" className="link-arrow">
            اكتشف البرنامج يومًا بيوم <ArrowIcon width={18} height={18} />
          </a>
        </Reveal>
        <div className="why-cards">
          {CONTEXT.map(([t, d], i) => {
            const Icon = CONTEXT_ICONS[i]
            return (
              <Reveal key={t} className="why-card" delay={i * 0.06}>
                <span className="ico">
                  <Icon width={24} height={24} />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Outcomes ---------- */
const OUTCOME_ICONS = [TargetIcon, ShieldIcon, LayersIcon, UsersIcon, GameIcon, SparkIcon, MonitorIcon, ChartIcon, MicIcon]

export function Outcomes() {
  return (
    <section className="sec sec-soft" id="outcomes">
      <div className="wrap">
        <SectionTitle kicker="الأهداف والكفاءات المستهدفة" title="ماذا ستصبح قادرًا على فعله؟" text="في نهاية الدورة يكون المشارك قادرًا على تحقيق نواتج تعلّم قابلة للقياس في 9 كفاءات مهنية." />
        <Reveal className="goal">
          <span className="goal-tag">الهدف العام</span>
          <p>{GOAL}</p>
        </Reveal>
        <div className="outcomes">
          {OUTCOMES.map(([t, d], i) => {
            const Icon = OUTCOME_ICONS[i]
            return (
              <Reveal key={t} className="outcome" delay={(i % 3) * 0.06}>
                <div className="outcome-top">
                  <span className="ico">
                    <Icon width={22} height={22} />
                  </span>
                  <span className="num" dir="ltr">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Approach & techniques ---------- */
export function Approach() {
  const steps = [
    ['عِش', 'كمتعلّم', 'تعيش كل تقنية أولًا من مقعد المشارك.'],
    ['حلّل', 'كمصمّم', 'تفكّكها: لماذا نجحت؟ ومتى تُستعمل؟'],
    ['طبّق', 'كمدرّب', 'تمارسها بنفسك أمام المجموعة وتتلقى تغذية راجعة.'],
  ]
  return (
    <section className="sec sec-dark" id="approach">
      <div className="wrap">
        <SectionTitle light kicker="المقاربة البيداغوجية" title="الدورة تُطبّق ما تُعلّمه" text="كل تقنية يتعرّف عليها المشارك يعيشها أولًا كمتعلّم، ثم يحلّلها كمصمّم، ثم يمارسها كمدرّب. هذا هو مبدأ «عِش، حلّل، طبّق»." />
        <div className="steps3">
          {steps.map(([t, as, d], i) => (
            <Reveal key={t} className="step3" delay={i * 0.08}>
              <span className="step3-n" dir="ltr">
                {i + 1}
              </span>
              <h3>
                {t} <small>{as}</small>
              </h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="tech-head">
          <h3>أحدث تقنيات التدريب التي ستعيشها وتمارسها</h3>
          <span className="ratio">
            <b>75%</b> ممارسة وتطبيق · <b>25%</b> مفاهيم
          </span>
        </Reveal>
        <div className="techs">
          {TECHNIQUES.map(([t, en, gain, when], i) => (
            <Reveal key={t} className="tech" delay={(i % 3) * 0.05}>
              <span className="tech-when">{when}</span>
              <h4>{t}</h4>
              <span className="tech-en" dir="ltr">
                {en}
              </span>
              <p>{gain}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="diff">
          <AwardIcon width={30} height={30} />
          <p>
            <b>ما يميّز هذه الدورة:</b> مسار تعلّم يمتد 30 يومًا بعد الأيام الحضورية، ومشروع شخصي يُنجز طوال الدورة، وكل مشارك يُدرّب فعليًا مرتين على الأقل
            ويحصل على تسجيل مصوَّر لأدائه.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Journey (in person + 30-day follow-up) ---------- */
export function Journey() {
  return (
    <section className="sec" id="journey">
      <div className="wrap">
        <SectionTitle
          kicker="حضوري + متابعة بعدية"
          title="رحلة تعلّم كاملة، لا 4 أيام فقط"
          text="4 أيام حضورية مكثفة بسطيف، ثم 30 يومًا من المتابعة لترسيخ التحويل إلى الممارسة."
        />
        <div className="journey n2">
          <Reveal className="phase phase-main">
            <span className="phase-tag">{COURSE.dates}</span>
            <h3>4 أيام حضورية بسطيف</h3>
            <p className="phase-when">28 ساعة تدريبية · {COURSE.hours}</p>
            <ol className="days-mini">
              {DAYS.map((d) => (
                <li key={d.label}>
                  <b>{d.label}</b>
                  <span>{d.title}</span>
                </li>
              ))}
            </ol>
            <a href="#program" className="link-arrow light">
              البرنامج التفصيلي <ArrowIcon width={18} height={18} />
            </a>
          </Reveal>
          <Reveal className="phase phase-remote" delay={0.08}>
            <span className="phase-tag">بعد الدورة</span>
            <h3>{POST_PHASE.title}</h3>
            <p className="phase-when">{POST_PHASE.when}</p>
            <ul className="ticks">
              {POST_PHASE.items.map((x) => (
                <li key={x}>
                  <CheckIcon width={18} height={18} />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Programme ---------- */
export function Program() {
  const [active, setActive] = useState(0)
  const day = DAYS[active]
  const onKey = (e) => {
    // Arrow keys move between tabs (RTL: left = next)
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const dir = e.key === 'ArrowLeft' ? 1 : -1
    const next = (active + dir + DAYS.length) % DAYS.length
    setActive(next)
    document.getElementById(`tab-${next}`)?.focus()
  }
  return (
    <section className="sec sec-soft" id="program">
      <div className="wrap">
        <SectionTitle kicker="البرنامج التفصيلي" title="4 أيام، 4 محطات، 4 منتجات جاهزة" text="يمتد اليوم التدريبي من 08:30 إلى 16:30 (7 ساعات فعلية مع استراحتين وغداء). يبدأ كل يوم بـ«استرجاع صباحي» وينتهي بـ«تذكرة خروج» تقيس ما تثبّت." />
        <div className="tabs" role="tablist" aria-label="أيام الدورة" onKeyDown={onKey}>
          {DAYS.map((d, i) => (
            <button
              key={d.label}
              id={`tab-${i}`}
              role="tab"
              aria-selected={i === active}
              aria-controls="day-panel"
              tabIndex={i === active ? 0 : -1}
              className={`tab${i === active ? ' on' : ''}`}
              onClick={() => setActive(i)}
            >
              <b>{d.label}</b>
              <small>{d.date}</small>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id="day-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            className="day"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="day-head">
              <h3>
                {day.label} — {day.title}
              </h3>
              <p>{day.sub}</p>
            </div>
            <ol className="slots">
              {day.rows.map(([time, topic, acts]) => (
                <li key={time} className="slot">
                  <span className="slot-time" dir="ltr">
                    {time}
                  </span>
                  <div className="slot-body">
                    <h4>{topic}</h4>
                    <p>{acts}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="product">
              <span>مُنتج اليوم</span>
              <p>{day.product}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ---------- Trainers ---------- */
// Everything we know about a trainer, shown in the «المزيد» window
function TrainerDetails({ t }) {
  return (
    <div className="td-body">
      {t.award && (
        <p className="td-award">
          <AwardIcon width={20} height={20} />
          <span>
            <b>{t.award}</b>
            <small dir="ltr">{t.awardBy}</small>
          </span>
        </p>
      )}
      {t.tags && (
        <div className="ft-tags">
          {t.tags.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      )}
      {t.numbers && (
        <div className="lead-nums">
          {t.numbers.map(([n, l]) => (
            <span key={l}>
              <b dir="ltr">{n}</b>
              <small>{l}</small>
            </span>
          ))}
        </div>
      )}
      {Array.isArray(t.bio) ? (
        <>
          <h4 className="ft-sub">نبذة</h4>
          <ul className="ticks">
            {t.bio.map((x) => (
              <li key={x}>
                <CheckIcon width={18} height={18} />
                {x}
              </li>
            ))}
          </ul>
        </>
      ) : (
        t.bio && (
          <>
            <h4 className="ft-sub">نبذة مهنية</h4>
            <p className="ft-bio">{t.bio}</p>
          </>
        )
      )}
      {t.areas && (
        <>
          <h4 className="ft-sub">مجالات التدريب والتخصص</h4>
          <ul className="ft-areas">
            {t.areas.map(([title, desc]) => (
              <li key={title}>
                <b>{title}</b>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {t.skills && (
        <>
          <h4 className="ft-sub">الكفاءات والمهارات التدريبية</h4>
          <ul className="ticks ft-skills">
            {t.skills.map((x) => (
              <li key={x}>
                <CheckIcon width={18} height={18} />
                {x}
              </li>
            ))}
          </ul>
        </>
      )}
      {t.vision && (
        <blockquote className="ft-vision">
          <b>الرؤية التدريبية</b>
          <p>{t.vision}</p>
        </blockquote>
      )}
    </div>
  )
}

// Full profile in a native modal dialog: traps focus, closes with Esc, the × button or a click outside
function TrainerDialog({ t, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal?.()
    d?.addEventListener('close', onClose)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      d?.removeEventListener('close', onClose)
      document.body.style.overflow = prev
    }
  }, [onClose])
  return (
    <dialog
      ref={ref}
      className="tdialog"
      aria-labelledby="tdialog-title"
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="td-inner">
        <button type="button" className="td-close" onClick={onClose} aria-label="إغلاق">
          ×
        </button>
        <div className="td-head">
          <Avatar src={t.photo} initials={t.initials} alt={t.name} className="lg" />
          <div>
            <span className="kicker">{t.role}</span>
            <h3 id="tdialog-title">{t.name}</h3>
            {t.headline && <p className="ft-headline">{t.headline}</p>}
          </div>
        </div>
        <TrainerDetails t={t} />
      </div>
    </dialog>
  )
}

// A trainer has a full profile to open with «المزيد» when we have more than the card shows
const hasDetails = (t) => Boolean(t.bio || t.areas || t.skills || t.vision || t.numbers)

export function Trainers() {
  // The four trainers, same card and same photo size; the lead trainer first
  const team = [{ ...LEAD_TRAINER, key: 'lead' }, ...CO_TRAINERS.map((c) => ({ ...c, key: c.name }))]
  const [openKey, setOpenKey] = useState(null)
  const open = team.find((p) => p.key === openKey)
  const close = useRef(() => setOpenKey(null)).current
  return (
    <section className="sec" id="trainers">
      <div className="wrap">
        <SectionTitle
          kicker="فريق التأطير"
          title="4 مدربين لمتابعة فردية دقيقة"
          text="يؤطّر الدورة فريق من 4 مدربين بقيادة د. أيوب بوخاتم، ما يسمح بمتابعة فردية دقيقة وبتنشيط التدريب المصغّر في قاعات متوازية بتقييم مدرّب مختص في كل قاعة."
        />
        <div className="team">
          {team.map((p, i) => (
            <Reveal key={p.key} className="team-card" delay={i * 0.06}>
              <Avatar src={p.portrait || p.photo} initials={p.initials} alt={p.name} className="portrait" />
              <div className="team-body">
                <span className="team-role">{p.role}</span>
                <h3>{p.name}</h3>
                {hasDetails(p) && (
                  <div className="team-actions">
                    <button type="button" className="btn btn-more" onClick={() => setOpenKey(p.key)} aria-haspopup="dialog">
                      المزيد
                      <ArrowIcon width={18} height={18} />
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      {open && <TrainerDialog t={open} onClose={close} />}
    </section>
  )
}

/* ---------- Certification ---------- */
export function Certification() {
  return (
    <section className="sec sec-soft" id="certification">
      <div className="wrap">
        <SectionTitle kicker="نظام التقييم والإشهاد" title="شهادتان مشتركتان تُثبتان كفاءتك" text="يُمنح لقب «مدرّب محترف» لمن يجمع 70 نقطة على الأقل من 100، مع حضور لا يقل عن 90% من الساعات. تصدر الشهادات بشكل مشترك عن Almaahed International (المعهد إنترناشيونال) و e-Saboura (السبورة)." />
        <div className="cert-grid">
          <Reveal className="cert-visual">
            <div className="cert-paper">
              <div className="cert-logos">
                <img src={almaahedLogo} alt="" />
                <img src={esabouraMark} alt="" />
              </div>
              <span className="cert-kind">شهادة</span>
              <h3>مدرّب محترف 4.0</h3>
              <p dir="ltr">Professional Trainer — {COURSE.code}</p>
              <div className="cert-line" />
              <div className="cert-foot">
                <span>
                  <b dir="ltr">≥ 70/100</b>
                  <small>النقطة الدنيا</small>
                </span>
                <span>
                  <b dir="ltr">≥ 90%</b>
                  <small>الحضور</small>
                </span>
              </div>
              <span className="seal" aria-hidden="true">
                <AwardIcon width={34} height={34} />
              </span>
            </div>
            <p className="cert-note">ولمن لم يستوفِ معايير لقب «مدرّب محترف»: شهادة مشاركة.</p>
          </Reveal>
          <Reveal className="assess" delay={0.08}>
            <h3>مكوّنات التقييم</h3>
            {ASSESSMENT.map(([c, tool, w]) => (
              <div key={c} className="bar-row">
                <div className="bar-top">
                  <b>{c}</b>
                  <span dir="ltr">{w}%</span>
                </div>
                <div className="bar">
                  <motion.span initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                </div>
                <p>{tool}</p>
              </div>
            ))}
            <h3 className="mt">مستويات قياس أثر الدورة نفسها</h3>
            <ol className="levels">
              {IMPACT_LEVELS.map(([t, d], i) => (
                <li key={t}>
                  <span dir="ltr">{i + 1}</span>
                  <div>
                    <b>{t}</b>
                    <p>{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Kit ---------- */
export function Kit() {
  return (
    <section className="sec" id="kit">
      <div className="wrap">
        <SectionTitle kicker="الحقيبة التدريبية والمخرجات" title="تغادر بحقيبتين" text="ما تتسلّمه من فريق التأطير، وما تُنتجه بنفسك خلال الدورة." />
        <div className="kit-grid">
          <Reveal className="kit kit-receive">
            <span className="kit-ico">
              <BriefcaseIcon width={26} height={26} />
            </span>
            <h3>ما تتسلّمه</h3>
            <ul className="ticks">
              {KIT_RECEIVE.map((x) => (
                <li key={x}>
                  <CheckIcon width={18} height={18} />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="kit kit-produce" delay={0.08}>
            <span className="kit-ico">
              <BookIcon width={26} height={26} />
            </span>
            <h3>ما تُنتجه (ملف المشروع)</h3>
            <ul className="ticks">
              {KIT_PRODUCE.map((x) => (
                <li key={x}>
                  <CheckIcon width={18} height={18} />
                  {x}
                </li>
              ))}
            </ul>
            <div className="kit-video">
              <VideoIcon width={22} height={22} />
              <span>كل مشارك يُدرّب فعليًا مرتين على الأقل ويحصل على تسجيل مصوَّر لأدائه.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Audience & logistics ---------- */
const LOGISTICS_ICONS = [MapIcon, MonitorIcon, ClockIcon, MicIcon]

export function Audience() {
  return (
    <section className="sec sec-soft" id="audience">
      <div className="wrap">
        <SectionTitle kicker="الفئة المستهدفة" title="لمن هذه الدورة؟" />
        <Reveal className="chips">
          {AUDIENCE.map((a) => (
            <span key={a} className="chip">
              <CheckIcon width={16} height={16} />
              {a}
            </span>
          ))}
        </Reveal>
        <div className="aud-grid">
          <Reveal className="aud-box">
            <h3>
              <LaptopIcon width={24} height={24} /> المتطلبات المسبقة
            </h3>
            <ul className="ticks">
              {PREREQS.map((x) => (
                <li key={x}>
                  <CheckIcon width={18} height={18} />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          {LOGISTICS.map(([t, d], i) => {
            const Icon = LOGISTICS_ICONS[i]
            return (
              <Reveal key={t} className="aud-box" delay={(i + 1) * 0.05}>
                <h3>
                  <Icon width={24} height={24} /> {t}
                </h3>
                <p>{d}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Pricing ---------- */
export function Pricing() {
  const pct = Math.round((seatsLeft / COURSE.seats) * 100)
  const tiers = [
    EARLY_ACTIVE && {
      key: 'early',
      tag: `التسجيل المبكر · ${EARLY.label}`,
      who: 'لكل من يسجّل قبل 1 ديسمبر',
      price: EARLY.price,
      was: EARLY.was,
      note: 'ينتهي يوم 30 نوفمبر',
      hot: true,
    },
    {
      key: 'alumni',
      tag: 'مشاركو منصة السبورة',
      who: 'لمن شارك معنا ولو في دورة واحدة على منصة السبورة',
      price: ALUMNI.price,
      gift: ALUMNI.giftLong,
      note: 'ساري حتى بداية الدورة',
      hot: !EARLY_ACTIVE,
    },
    {
      key: 'full',
      tag: 'السعر الكلي',
      who: EARLY_ACTIVE ? 'ابتداءً من 1 ديسمبر' : 'لكل المسجلين',
      price: FULL_PRICE,
    },
  ].filter(Boolean)
  return (
    <section className="sec sec-dark" id="pricing">
      <div className="wrap">
        <SectionTitle light kicker="الشروط التنظيمية والمالية" title="استثمر في مسارك كمدرّب" text={`الرسوم تشمل الدورة كاملة: 4 أيام حضورية + 30 يومًا من المتابعة البعدية. يُثبَّت المقعد بتسبيق ${formatDA(DEPOSIT)}، والباقي يُدفع نقدًا.`} />
        <div className={`tiers n${tiers.length}`}>
          {tiers.map((t, i) => (
            <Reveal key={t.key} className={`tier${t.hot ? ' hot' : ''}`} delay={i * 0.06}>
              <span className="tier-tag">{t.tag}</span>
              <p className="tier-who">{t.who}</p>
              <div className="tier-price">
                <b>{t.price.toLocaleString('en-US')}</b>
                <span>دج</span>
                {t.was && <s>{formatDA(t.was)}</s>}
              </div>
              {t.gift && <p className="tier-gift">+ {t.gift}</p>}
              <p className="tier-dep">
                التسبيق: <b>{formatDA(DEPOSIT)}</b> · الباقي نقدًا: <b>{formatDA(remainderFor(t.price))}</b>
              </p>
              {t.note && <small className="tier-note">{t.note}</small>}
            </Reveal>
          ))}
        </div>
        <Reveal className="ticket">
          <div className="ticket-main">
            <span className="ticket-tag">ما تشمله الرسوم</span>
            <p className="ticket-sub">نفس المحتوى والخدمات في كل الأسعار.</p>
            <ul className="ticks">
              {FEES_INCLUDE.map((x) => (
                <li key={x}>
                  <CheckIcon width={18} height={18} />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="ticket-side">
            <div className="deposit">
              <small>يُثبَّت المقعد بتسبيق</small>
              <b>{formatDA(DEPOSIT)}</b>
              <small>والباقي يُدفع نقدًا</small>
            </div>
            <div className="seats">
              <div className="seats-top">
                <span>المقاعد المتبقية</span>
                <b>
                  {seatsLeft} / {COURSE.seats}
                </b>
              </div>
              <div className="bar">
                <span style={{ width: `${pct}%` }} />
              </div>
              <small>الأولوية حسب ترتيب التسجيل وتأكيد الدفع.</small>
            </div>
            <div className="pay-methods" aria-label="طرق الدفع">
              <span>بطاقة CIB</span>
              <span>الذهبية</span>
              <span>CCP</span>
              <span>بريدي موب</span>
            </div>
            <a href="#register" className="btn btn-orange btn-lg btn-block">
              احجز مقعدك الآن
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
export function Faq() {
  return (
    <section className="sec" id="faq">
      <div className="wrap narrow">
        <SectionTitle kicker="أسئلة شائعة" title="قبل أن تسجّل" />
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className="faq-more">
          سؤال آخر؟ اتصل بنا على{' '}
          {PHONES.map((p, i) => (
            <span key={p.tel}>
              {i > 0 && ' أو '}
              <a href={`tel:${p.tel}`} dir="ltr">
                {p.display}
              </a>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

/* ---------- Footer & mobile bar ---------- */
export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <span className="foot-logos">
            <img src={almaahedLogo} alt="Almaahed International" />
            <img src={esabouraFull} alt="السبورة" className="foot-esaboura" />
          </span>
          <p>
            {COURSE.title}: {COURSE.subtitle}. تنظيم مشترك بين Almaahed International (المعهد إنترناشيونال) و e-Saboura (السبورة).
          </p>
        </div>
        <div>
          <h4>للاستفسار والتسجيل</h4>
          <div className="phones">
            {PHONES.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}>
                <PhoneIcon width={18} height={18} />
                <span dir="ltr">{p.display}</span>
              </a>
            ))}
            <a href={`https://wa.me/${WHATSAPP.wa}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width={18} height={18} />
              <span dir="ltr">{WHATSAPP.display}</span>
            </a>
          </div>
        </div>
        <div>
          <h4>روابط</h4>
          <div className="foot-links">
            {SITES.map((s) => (
              <a key={s} href={`https://${s}`} target="_blank" rel="noopener noreferrer">
                <span dir="ltr">{s}</span>
              </a>
            ))}
            {SHOW_TECH_CARD && (
              <a href={PDF_URL} target="_blank" rel="noopener">
                البطاقة التقنية (PDF)
              </a>
            )}
            <a href="#pricing">الرسوم</a>
            <a href="#register">التسجيل</a>
          </div>
        </div>
      </div>
      <p className="copy">
        © {new Date().getFullYear()} Almaahed International × e-Saboura · {VENUE.name}، {VENUE.city}
      </p>
    </footer>
  )
}

export function MobileBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => {
      const form = document.getElementById('register')
      const past = window.scrollY > 600
      const atForm = form && form.getBoundingClientRect().top < window.innerHeight
      setShow(past && !atForm)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="mbar" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'tween', duration: 0.25 }}>
          <div className="mbar-price">
            <b>{formatDA(PRICE)}</b>
            {EARLY_ACTIVE ? (
              <small>
                بدل <s>{formatDA(EARLY.was)}</s>
              </small>
            ) : (
              <small>بقي {seatsLeft} مقعدًا</small>
            )}
          </div>
          <a href="#register" className="btn btn-orange">
            سجّل الآن
          </a>
          <a href={`https://wa.me/${WHATSAPP.wa}`} target="_blank" rel="noopener noreferrer" className="mbar-ico wa" aria-label="راسلنا على واتساب">
            <WhatsAppIcon width={22} height={22} />
          </a>
          <a href={`tel:${PHONES[0].tel}`} className="mbar-ico" aria-label="اتصل بنا">
            <PhoneIcon width={22} height={22} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
