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

export const PRICE = 90000
// The card says a 50% deposit confirms the seat. 50% of 90,000 DA is 45,000 DA
// (the card also prints "35,000 دج"; check which amount is right and set it here).
export const DEPOSIT = 45000

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
  slickLinks: {
    deposit: '', // link for DEPOSIT
    full: '', // link for PRICE
  },
  ccp: { account: '6650093', key: '11', holder: 'Abdeslam Hetatache' },
  baridimobRib: '00799999000665009314',
}

// Number that receives payment receipts on WhatsApp (same as the "الأستاذ الرقمي" page)
export const WHATSAPP = { display: '0676 10 13 71', wa: '213676101371' }
