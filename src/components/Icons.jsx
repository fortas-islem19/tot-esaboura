// Inline stroke icons (24×24). They inherit the current text colour.
const S = ({ children, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
)

export const CalendarIcon = (p) => (
  <S {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
  </S>
)
export const ClockIcon = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </S>
)
export const PinIcon = (p) => (
  <S {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </S>
)
export const UsersIcon = (p) => (
  <S {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
    <path d="M16 4.8a3.3 3.3 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.4 3.5 5.2" />
  </S>
)
export const CheckIcon = (p) => (
  <S {...p} strokeWidth="2.4">
    <path d="M5 12.5 10 17.5 19 7" />
  </S>
)
export const PhoneIcon = (p) => (
  <S {...p}>
    <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11 11 0 0 0 5.2 5.2l1.4-2.1 4.2 1.6V17a2.5 2.5 0 0 1-2.7 2.5C9.4 19 5 14.6 4.5 6.2A2.5 2.5 0 0 1 5 3.5Z" />
  </S>
)
export const WhatsAppIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
  </svg>
)
export const AwardIcon = (p) => (
  <S {...p}>
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14 -1.5 7 5-2.5 5 2.5-1.5-7" />
    <path d="m12 6.2.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3Z" />
  </S>
)
export const BrainIcon = (p) => (
  <S {...p}>
    <path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3.2 3.2 0 0 0 7 18a3 3 0 0 0 5 1.2V5.6A3 3 0 0 0 9 4.5Z" />
    <path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3.2 3.2 0 0 1 17 18a3 3 0 0 1-5 1.2" />
    <path d="M8.5 10.5h2M13.5 13.5h2" />
  </S>
)
export const TargetIcon = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </S>
)
export const SparkIcon = (p) => (
  <S {...p}>
    <path d="M12 3.5 13.8 9l5.7 1.9-5.7 1.9L12 18.5l-1.8-5.7L4.5 11l5.7-1.9Z" />
    <path d="M19 3v3M17.5 4.5h3M5 17v3M3.5 18.5h3" />
  </S>
)
export const GameIcon = (p) => (
  <S {...p}>
    <path d="M7 7.5h10a4.5 4.5 0 0 1 4.3 5.8l-1 3.4a2.4 2.4 0 0 1-4.2.8L14.5 15h-5l-1.6 2.5a2.4 2.4 0 0 1-4.2-.8l-1-3.4A4.5 4.5 0 0 1 7 7.5Z" />
    <path d="M8 10v3M6.5 11.5h3" />
    <circle cx="15.5" cy="10.5" r=".6" fill="currentColor" />
    <circle cx="17" cy="12.5" r=".6" fill="currentColor" />
  </S>
)
export const MonitorIcon = (p) => (
  <S {...p}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2.2" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </S>
)
export const ChartIcon = (p) => (
  <S {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="m7.5 15 3.5-4 3 2.5 5-6" />
  </S>
)
export const MicIcon = (p) => (
  <S {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </S>
)
export const MapIcon = (p) => (
  <S {...p}>
    <path d="m9 4.5-5.5 2v13l5.5-2 6 2 5.5-2v-13l-5.5 2Z" />
    <path d="M9 4.5v13M15 6.5v13" />
  </S>
)
export const LayersIcon = (p) => (
  <S {...p}>
    <path d="m12 3 9 4.8-9 4.8-9-4.8Z" />
    <path d="m3 12.2 9 4.8 9-4.8M3 16.5l9 4.8 9-4.8" />
  </S>
)
export const BookIcon = (p) => (
  <S {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
  </S>
)
export const VideoIcon = (p) => (
  <S {...p}>
    <rect x="2.5" y="5.5" width="13.5" height="13" rx="2.5" />
    <path d="m16 10.5 5.5-3v9l-5.5-3" />
  </S>
)
export const RepeatIcon = (p) => (
  <S {...p}>
    <path d="M17 2.5 20.5 6 17 9.5" />
    <path d="M3.5 11.5V10a4 4 0 0 1 4-4h13" />
    <path d="M7 21.5 3.5 18 7 14.5" />
    <path d="M20.5 12.5V14a4 4 0 0 1-4 4h-13" />
  </S>
)
export const BriefcaseIcon = (p) => (
  <S {...p}>
    <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
    <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7M2.5 12.5h19" />
  </S>
)
export const ArrowIcon = (p) => (
  <S {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </S>
)
export const LaptopIcon = (p) => (
  <S {...p}>
    <rect x="4" y="4.5" width="16" height="11" rx="1.8" />
    <path d="M2 19.5h20" />
  </S>
)
export const ShieldIcon = (p) => (
  <S {...p}>
    <path d="M12 2.8 4.5 5.8v5.7c0 4.6 3.1 8.2 7.5 9.7 4.4-1.5 7.5-5.1 7.5-9.7V5.8Z" />
    <path d="m8.8 12 2.2 2.2 4.4-4.4" />
  </S>
)
