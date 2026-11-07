// Everything that changes between editions lives here: dates, price, seats, payment and contacts.
// Course content (programme, outcomes, FAQ...) is in src/data.js.

// FormBold form ID (the part after formbold.com/s/): this course's own form,
// https://formbold.com/s/9xKjX. VITE_FORM_ENDPOINT in .env overrides it.
export const FORMBOLD_FORM_ID = '9xKjX'

export const FORM_ENDPOINT =
  import.meta.env?.VITE_FORM_ENDPOINT || (FORMBOLD_FORM_ID ? `https://formbold.com/s/${FORMBOLD_FORM_ID}` : '')

// From the technical card (البطاقة التقنية — ToT-PRO-26)
export const COURSE = {
  code: 'ToT-PRO-26',
  title: 'المدرّب المحترف 4.0',
  subtitle: 'تصميم تجارب التعلّم وتيسيرها بأحدث التقنيات',
  english: 'Training of Trainers (ToT) Advanced Programme',
  dates: '9 – 12 ديسمبر 2026',
  datesLong: 'من 9 إلى 12 ديسمبر 2026',
  hours: 'من 08:30 إلى 16:30',
  // Start of day one, used by the countdown (Algeria time, UTC+1)
  startsAt: '2026-12-09T08:30:00+01:00',
  days: 4,
  totalHours: 28,
  // Registration is capped at 20 participants (the card's general range is 10 to 30)
  seats: 20,
  city: 'سطيف',
  organizers: 'المعهد إنترناشيونال × السبورة',
}

// Full fee for the course
export const FULL_PRICE = 90000

// Early registration: 63,000 DA (shown "instead of 70,000 DA") for everyone who registers
// before 1 December 2026. After endsAt the page switches to FULL_PRICE on its own.
export const EARLY = {
  price: 63000,
  was: 70000,
  endsAt: '2026-11-30T23:59:59+01:00', // end of 30 November, Algeria time
  label: 'قبل 1 ديسمبر',
}
export const EARLY_ACTIVE = Date.now() < new Date(EARLY.endsAt).getTime()

// People who took at least one course on the e-Saboura platform: 63,000 DA until the course
// starts, plus a free one-month Claude account on their personal email.
export const ALUMNI = {
  price: 63000,
  gift: 'حساب Claude لمدة شهر مجانًا',
  giftLong: 'حساب Claude لمدة شهر مجانًا على بريدك الإلكتروني الشخصي',
}

// Fee for a new participant right now, and the fee for a given registration
export const PRICE = EARLY_ACTIVE ? EARLY.price : FULL_PRICE
export const priceFor = (alumni) => (alumni ? Math.min(ALUMNI.price, PRICE) : PRICE)
// A fixed 23,000 DA deposit confirms the seat, paid online or by transfer;
// the rest of the fee is paid in cash.
export const DEPOSIT = 23000
export const remainderFor = (price) => price - DEPOSIT

// The technical card PDF still carries the old dates (25–28 November). Set this to true
// once public/fiche-technique-tot-pro-26.pdf is replaced with the updated card.
export const SHOW_TECH_CARD = false

// Seats already booked. Drives the "seats left" bar; update it as registrations come in.
export const SEATS_TAKEN = 0

export const VENUE = {
  name: 'مقر مدرسة السبورة (e-Saboura)',
  city: 'سطيف',
  // Optional Google Maps link to the venue. Leave empty to hide the map button.
  mapsLink: '',
}

export const formatDA = (n) => `${n.toLocaleString('en-US')} دج`

// e-Saboura phone numbers
export const PHONES = [
  { display: '0676 10 13 71', tel: '+213676101371' },
  { display: '0561 46 84 57', tel: '+213561468457' },
]

export const SITES = ['almaahed.com', 'esaboura.com']

// Payment: same methods and accounts as the "الأستاذ الرقمي" page.
export const PAYMENT = {
  // Slick-Pay link (CIB / Edahabia) for the 23,000 DA deposit. Leave empty to hide online payment.
  slickLink: 'https://slick-pay.com/slicklink/details/SLK-0400484BZUH',
  ccp: { account: '6650093', key: '11', holder: 'Abdeslam Hetatache' },
  baridimobRib: '00799999000665009314',
}

// Number that receives payment receipts on WhatsApp (same as the "الأستاذ الرقمي" page)
export const WHATSAPP = { display: '0676 10 13 71', wa: '213676101371' }
