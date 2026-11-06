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
  dates: '25 – 28 نوفمبر 2026',
  datesLong: 'من 25 إلى 28 نوفمبر 2026',
  hours: 'من 08:30 إلى 16:30',
  // Start of day one, used by the countdown (Algeria time, UTC+1)
  startsAt: '2026-11-25T08:30:00+01:00',
  days: 4,
  totalHours: 28,
  // Registration is capped at 20 participants (the card's general range is 10 to 30)
  seats: 20,
  city: 'سطيف',
  organizers: 'المعهد إنترناشيونال × السبورة',
}

// Regular fee from the technical card
export const FULL_PRICE = 90000

// Launch offer: 57,000 DA instead of 90,000 DA for registrations until 22 November 2026.
// After endsAt the page switches back to FULL_PRICE on its own.
export const OFFER = {
  price: 57000,
  endsAt: '2026-11-22T23:59:59+01:00', // end of 22 November, Algeria time
  label: 'إلى غاية 22 نوفمبر',
}
export const OFFER_ACTIVE = Date.now() < new Date(OFFER.endsAt).getTime()

// Fee that applies right now
export const PRICE = OFFER_ACTIVE ? OFFER.price : FULL_PRICE
// A 50% deposit confirms the seat (28,500 DA during the offer, 45,000 DA after it)
export const DEPOSIT = Math.round(PRICE / 2)

// Seats already booked. Drives the "seats left" bar; update it as registrations come in.
export const SEATS_TAKEN = 0

export const VENUE = {
  name: 'مقر السبورة (e-Saboura)',
  city: 'سطيف',
  // Optional Google Maps link to the venue. Leave empty to hide the map button.
  mapsLink: '',
}

export const formatDA = (n) => `${n.toLocaleString('en-US')} دج`

// Contact numbers from the technical card
export const PHONES = [
  { display: '0770 80 82 32', tel: '+213770808232' },
  { display: '0770 75 62 35', tel: '+213770756235' },
]

export const SITES = ['almaahed.com', 'esaboura.com']

// Payment: same methods and accounts as the "الأستاذ الرقمي" page.
export const PAYMENT = {
  // Slick-Pay payment links (CIB / Edahabia), created in the Slick-Pay dashboard for THIS course.
  // The online option only shows for an amount whose link is filled in.
  // During the offer the amounts are 28,500 DA (deposit) and 57,000 DA (full);
  // after 22 November they become 45,000 DA and 90,000 DA, so the links need updating then.
  slickLinks: {
    deposit: '', // link for DEPOSIT
    full: '', // link for PRICE
  },
  ccp: { account: '6650093', key: '11', holder: 'Abdeslam Hetatache' },
  baridimobRib: '00799999000665009314',
}

// Number that receives payment receipts on WhatsApp (same as the "الأستاذ الرقمي" page)
export const WHATSAPP = { display: '0676 10 13 71', wa: '213676101371' }
