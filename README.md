# ToT Esaboura — المدرّب المحترف 4.0

Landing page and registration form for the joint **Almaahed International × e-Saboura** course *المدرّب المحترف 4.0: تصميم تجارب التعلّم وتيسيرها بأحدث التقنيات* (Training of Trainers Advanced Programme, `ToT-PRO-26`), held 9–12 December 2026 at the e-Saboura school (مقر مدرسة السبورة) in Sétif. All content comes from the course's technical card (البطاقة التقنية). The card PDF (`public/fiche-technique-tot-pro-26.pdf`) still shows the old dates, so its download links are hidden (`SHOW_TECH_CARD` in `src/config.js`) until it is replaced with the updated card.

Built with React, Vite and Framer Motion, like the "الأستاذ الرقمي" page (`Digital-Tutor-Algiers`), and it takes the same payment flow.

## Sections

1. Announcement bar and sticky header with both logos
2. Hero: title, lead trainer, and an event card with a live countdown (to the end of early registration, then to day one), key facts, price, deposit and the e-Saboura alumni offer
3. The course in numbers, plus a scrolling strip of models and tools
4. Why this course (context)
5. The 9 target competencies and their measurable outcomes
6. The approach («عِش، حلّل، طبّق») and the 14 techniques, with the day each is practised
7. The path: 4 in-person days, then a 30-day follow-up
8. Detailed programme, with a tab for each day and that day's product
9. Trainers: the lead trainer and Prof. Tebbani in two cards of the same size (large photo, short summary and a «المزيد» button that opens the full profile in a window), then the 2 other co-trainers
10. Assessment and certification (weights, thresholds, impact levels)
11. Training kit: what you receive and what you produce
12. Who it's for, prerequisites, room and equipment
13. Price cards (early registration, e-Saboura alumni, full price), then what the fee includes, seats left and payment methods
14. FAQ
15. Registration form in 3 steps
16. Footer, plus a bar fixed to the bottom of phone screens

Course content lives in `src/data.js`; dates, price, deposit, seats, venue, phones and payment details are in `src/config.js`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

`vite.config.js` uses `base: './'`, so `dist/` works on Vercel, Netlify, GitHub Pages or any static host.

## Trainer photos

The photos are in `public/trainers/`. To replace one, keep the same file name (square for co-trainers, 4:5 portrait for the lead trainer):

| Trainer | File |
| --- | --- |
| د. أيوب بوخاتم | `ayoub-boukhatem.jpg` |
| د. عبد الفتاح تباني | `abdelfattah-tebbani.jpg` |
| المدرب محمد فراني | `mohamed-ferrani.jpg` |
| المدرب عبد القادر وابل | `abdelkader-ouabel.jpg` |

If a photo file is missing, its card shows the trainer's initials instead. The co-trainers' bios are in `CO_TRAINERS` in `src/data.js`.

## Registration form

Validation (in `src/lib/validate.js`):

- Full name: letters only, first name and surname
- Phone: Algerian mobile (05/06/07). Accepts `0661234567`, `06 61 23 45 67`, `+213…` and `00213…`, and is sent as `0XXXXXXXXX`
- Email, wilaya, status (الصفة), training experience, device: required
- Organisation: optional
- Took a course on the e-Saboura platform (yes/no): required; if yes, the course name is required
- Payment method for the deposit: required
- Consent: required
- A hidden honeypot field drops bot submissions

Submissions go to FormBold as JSON with Arabic field names, the course name, the alumni answer, the price that applied (`السعر المطبّق`), the deposit, the cash remainder and the payment method. The form is `https://formbold.com/s/9xKjX` (`FORMBOLD_FORM_ID` in `src/config.js`). To use another service, set `VITE_FORM_ENDPOINT` in `.env`.

## Payment

Same methods and accounts as the "الأستاذ الرقمي" page. The registration is always sent to FormBold first.

- **Online (الدفع الإلكتروني):** after registering, the person is sent to the Slick-Pay link for the 23,000 DA deposit (`PAYMENT.slickLink` in `src/config.js`, CIB / Edahabia). With the link empty, the online option is hidden.
- **Post office transfer (الدفع عبر البريد):** the CCP and BaridiMob details appear in the form and again on the thank-you screen, each with a copy button. A button opens WhatsApp (`WHATSAPP`) with a ready-made message for sending the receipt.

## Meta Pixel and Conversions API

The page uses the Meta Pixel **1119345057627502** ("Esaboura TOT"), set in `index.html` (`window.META_PIXEL_ID`, plus the `<noscript>` image). Each event is sent twice with the same event ID, once by the browser pixel and once from the server through the Conversions API, so Meta counts it once but still receives it when a browser blocks the pixel:

- `PageView` on every visit
- `Purchase` when FormBold accepts a registration, with the deposit (23,000 DZD) as the value and the status (الصفة) as `content_category`

The server side is the Vercel function `api/meta-event.js`. It only accepts these two events, only from the site's own pages, and sends Meta the visitor's IP, browser, `_fbp`/`_fbc` cookies and, for `Purchase`, the email, phone and name hashed with SHA-256 (never in plain text). The form tells people this under the submit button.

The access token is **not** in the code: it is the Vercel environment variable `META_CAPI_TOKEN` (type "sensitive", Production and Preview). Optional variables: `META_TEST_EVENT_CODE` (to see server events under Events Manager → Test events), `META_GRAPH_VERSION` (default `v23.0`) and `META_PIXEL_ID`. After changing a variable, redeploy. `GET /api/meta-event` answers `{"ok":true,"configured":true}` when the token is set.

## Prices

All prices are in `src/config.js`:

| Who | Price | Until |
| --- | --- | --- |
| Everyone who registers before 1 December (`EARLY`) | 63,000 DA, shown "instead of 70,000 DA" | end of 30 November |
| People who took at least one course on the e-Saboura platform (`ALUMNI`) | 63,000 DA + a free one-month Claude account on their personal email | the start of the course |
| Everyone else (`FULL_PRICE`) | 90,000 DA | from 1 December |

Whatever the price, the seat is confirmed with a fixed **23,000 DA deposit** (`DEPOSIT`), paid online or by transfer; the rest is paid in cash. The form shows each person their price, the deposit and the remainder.

On 1 December the page switches by itself: the early-registration card and banner disappear, the price becomes 90,000 DA, and the hero countdown counts down to the first day instead of the end of early registration.

## Updating

- `SEATS_TAKEN` in `src/config.js` drives "seats left" across the page; update it as registrations come in.
- `EARLY`, `ALUMNI` and `FULL_PRICE` in `src/config.js`: change prices, the early-registration deadline or the alumni gift.
- `SHOW_TECH_CARD`: set to `true` after replacing the PDF with the updated technical card.
- `VENUE.mapsLink`: optional Google Maps link to the venue.
