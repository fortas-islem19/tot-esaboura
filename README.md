# ToT Esaboura — المدرّب المحترف 4.0

Landing page and registration form for the joint **Almaahed International × e-Saboura** course *المدرّب المحترف 4.0: تصميم تجارب التعلّم وتيسيرها بأحدث التقنيات* (Training of Trainers Advanced Programme, `ToT-PRO-26`), held 25–28 November 2026 at the e-Saboura venue in Sétif. All content comes from the course's technical card (البطاقة التقنية), which can be downloaded from the page (`public/fiche-technique-tot-pro-26.pdf`).

Built with React, Vite and Framer Motion, like the "الأستاذ الرقمي" page (`Digital-Tutor-Algiers`), and it takes the same payment flow.

## Sections

1. Announcement bar and sticky header with both logos
2. Hero: title, lead trainer, PDF button, and an event card with a live countdown (to the end of the offer, then to day one), key facts, price and deposit
3. The course in numbers, plus a scrolling strip of models and tools
4. Why this course (context)
5. The 9 target competencies and their measurable outcomes
6. The approach («عِش، حلّل، طبّق») and the 14 techniques, with the day each is practised
7. The 6-week path: pre-phase, 4 in-person days, 30-day follow-up
8. Detailed programme, with a tab for each day and that day's product
9. Trainers: lead trainer and the 3 co-trainers
10. Assessment and certification (weights, thresholds, impact levels)
11. Training kit: what you receive and what you produce
12. Who it's for, prerequisites, room and equipment
13. Price ticket with deposit, seats left and payment methods
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

Put the photos in `public/trainers/` with these names (square or portrait, about 800px wide):

| Trainer | File |
| --- | --- |
| د. أيوب بوخاتم | `ayoub-boukhatem.jpg` |
| د. عبد الفتاح تباني | `abdelfattah-tebbani.jpg` |
| المدرب محمد فراني | `mohamed-ferrani.jpg` |
| المدرب عبد القادر وابل | `abdelkader-ouabel.jpg` |

Until a photo is there, its card shows the trainer's initials. The co-trainers' bios are in `CO_TRAINERS` in `src/data.js`.

## Registration form

Validation (in `src/lib/validate.js`):

- Full name: letters only, first name and surname
- Phone: Algerian mobile (05/06/07). Accepts `0661234567`, `06 61 23 45 67`, `+213…` and `00213…`, and is sent as `0XXXXXXXXX`
- Email, wilaya, status (الصفة), training experience, device: required
- Organisation and session topic: optional
- Amount (50% deposit or full fee) and payment method: required
- Consent: required
- A hidden honeypot field drops bot submissions

Submissions go to FormBold as JSON with Arabic field names, the course name and the chosen amount and method. The form is `https://formbold.com/s/9xKjX` (`FORMBOLD_FORM_ID` in `src/config.js`). To use another service, set `VITE_FORM_ENDPOINT` in `.env`.

## Payment

Same methods and accounts as the "الأستاذ الرقمي" page. The registration is always sent to FormBold first.

- **Online (الدفع الإلكتروني):** after registering, the person is sent to a Slick-Pay link (CIB / Edahabia). Fill in `PAYMENT.slickLinks.deposit` and/or `PAYMENT.slickLinks.full` in `src/config.js` with links created for this course. The online option only appears for an amount that has a link; with no links it is hidden.
- **Post office transfer (الدفع عبر البريد):** the CCP and BaridiMob details appear in the form and again on the thank-you screen, each with a copy button. A button opens WhatsApp (`WHATSAPP`) with a ready-made message for sending the receipt.

## Meta Pixel

Paste the Pixel ID into `window.META_PIXEL_ID` in `index.html`. With an ID set, the page tracks `PageView`, and `Purchase` (the chosen amount in DZD, with the status as `content_category`) once FormBold accepts a registration. With no ID, nothing is loaded.

## Price and offer

The regular fee is 90,000 DA (`FULL_PRICE`). Until **22 November 2026** (`OFFER.endsAt`) the page shows a special price of **57,000 DA** (`OFFER.price`) instead of 90,000 DA: in the announcement bar, the hero card (whose countdown then counts down to the end of the offer), the price ticket, the FAQ, the form and the mobile bar. Each registration sent to FormBold also carries the price that applied (`السعر المطبّق`).

When the offer ends, the page switches back to 90,000 DA by itself and the countdown counts down to the first day of the course. The 50% deposit follows the price: 28,500 DA during the offer, 45,000 DA after it. If Slick-Pay links are used, create them for these amounts and update them after 22 November.

## Updating

- `SEATS_TAKEN` in `src/config.js` drives "seats left" across the page; update it as registrations come in.
- `OFFER` in `src/config.js`: change the price, end date or label of the offer.
- `VENUE.mapsLink`: optional Google Maps link to the venue.
