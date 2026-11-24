import {
  CardTemplate,
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
  GradientConfig,
  StudioState,
} from '../types';

export interface QrThemePreset {
  id: string;
  name: string;
  badge: string;
  dotsFill: GradientConfig;
  backgroundColor: string;
  dotType: DotStyle;
  cornerSquareType: CornerSquareStyle;
  cornerDotType: CornerDotStyle;
  customCorners?: boolean;
  cornerSquareColor?: string;
  cornerDotColor?: string;
  accentColor: string;
}

export const QR_THEME_PRESETS: QrThemePreset[] = [
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    badge: 'Modern',
    dotsFill: { mode: 'linear', color1: '#312E81', color2: '#4F46E5', rotation: 135 },
    backgroundColor: '#FFFFFF',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    customCorners: true,
    cornerSquareColor: '#312E81',
    cornerDotColor: '#6366F1',
    accentColor: '#4F46E5',
  },
  {
    id: 'classic-ink',
    name: 'Classic Ink',
    badge: 'Crisp',
    dotsFill: { mode: 'solid', color1: '#0F172A', color2: '#0F172A', rotation: 0 },
    backgroundColor: '#FFFFFF',
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square',
    accentColor: '#0F172A',
  },
  {
    id: 'ocean-pulse',
    name: 'Ocean Pulse',
    badge: 'Gradient',
    dotsFill: { mode: 'linear', color1: '#0369A1', color2: '#0D9488', rotation: 45 },
    backgroundColor: '#F8FAFC',
    dotType: 'dots',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    customCorners: true,
    cornerSquareColor: '#0C4A6E',
    cornerDotColor: '#0D9488',
    accentColor: '#0284C7',
  },
  {
    id: 'sunset-ember',
    name: 'Sunset Ember',
    badge: 'Warm',
    dotsFill: { mode: 'linear', color1: '#BE123C', color2: '#EA580C', rotation: 120 },
    backgroundColor: '#FFFBF7',
    dotType: 'classy-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    customCorners: true,
    cornerSquareColor: '#9F1239',
    cornerDotColor: '#F97316',
    accentColor: '#E11D48',
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    badge: 'Organic',
    dotsFill: { mode: 'linear', color1: '#064E3B', color2: '#15803D', rotation: 90 },
    backgroundColor: '#F3F7F5',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    accentColor: '#15803D',
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Luxe',
    badge: 'Luxury',
    dotsFill: { mode: 'linear', color1: '#5E481B', color2: '#A47D2E', rotation: 135 },
    backgroundColor: '#FCFAF6',
    dotType: 'classy-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    customCorners: true,
    cornerSquareColor: '#5E481B',
    cornerDotColor: '#B48D39',
    accentColor: '#B48D39',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    badge: 'Soft',
    dotsFill: { mode: 'solid', color1: '#6E3E3E', color2: '#9D4E5E', rotation: 0 },
    backgroundColor: '#FFF9F9',
    dotType: 'dots',
    cornerSquareType: 'dot',
    cornerDotType: 'dot',
    accentColor: '#C58484',
  },
  {
    id: 'cyber-dark',
    name: 'Cyber Dark',
    badge: 'Inverted',
    dotsFill: { mode: 'linear', color1: '#38BDF8', color2: '#A78BFA', rotation: 45 },
    backgroundColor: '#0F172A',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    customCorners: true,
    cornerSquareColor: '#7DD3FC',
    cornerDotColor: '#C4B5FD',
    accentColor: '#38BDF8',
  },
];

export interface CenterIconDef {
  id: string;
  label: string;
  svgInner: string;
}

export const CENTER_ICONS: CenterIconDef[] = [
  {
    id: 'link',
    label: 'Link',
    svgInner:
      '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'globe',
    label: 'Web',
    svgInner:
      '<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.1"/><path d="M2.5 12h19M12 2.5a14.5 14.5 0 0 1 0 19M12 2.5a14.5 14.5 0 0 0 0 19" fill="none" stroke="currentColor" stroke-width="2"/>',
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    svgInner:
      '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/>',
  },
  {
    id: 'chat',
    label: 'Chat',
    svgInner:
      '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="currentColor"/>',
  },
  {
    id: 'user',
    label: 'Contact',
    svgInner:
      '<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" fill="currentColor"/>',
  },
  {
    id: 'mail',
    label: 'Mail',
    svgInner:
      '<rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3 6l9 7 9-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: 'phone',
    label: 'Phone',
    svgInner:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>',
  },
  {
    id: 'bag',
    label: 'Shop',
    svgInner:
      '<path d="M6 7h12l1 13H5L6 7z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  },
  {
    id: 'coffee',
    label: 'Menu',
    svgInner:
      '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M6 2v2M10 2v2M14 2v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  {
    id: 'pin',
    label: 'Map',
    svgInner:
      '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#FFFFFF"/>',
  },
  {
    id: 'sparkle',
    label: 'Brand',
    svgInner:
      '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" fill="currentColor"/>',
  },
  {
    id: 'heart',
    label: 'Heart',
    svgInner:
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>',
  },
  {
    id: 'rings',
    label: 'Event',
    svgInner:
      '<circle cx="9.2" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="14.8" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="2.2"/>',
  },
  {
    id: 'music',
    label: 'Audio',
    svgInner:
      '<path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/>',
  },
  {
    id: 'camera',
    label: 'Photo',
    svgInner:
      '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="13" r="4" fill="currentColor"/>',
  },
  {
    id: 'shield',
    label: 'Verify',
    svgInner:
      '<path d="M12 2l8 4v6c0 5.25-3.4 9.74-8 11-4.6-1.26-8-5.75-8-11V6l8-4z" fill="currentColor"/><path d="M9 12l2 2 4-4" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  },
];

export const CARD_TEMPLATE_PRESETS: Record<
  CardTemplate,
  {
    label: string;
    cardBg: string;
    cardText: string;
    accentColor: string;
    fontStyle: StudioState['card']['fontStyle'];
    showInnerBorder: boolean;
  }
> = {
  'modern-minimal': {
    label: 'Modern Minimal',
    cardBg: '#FFFFFF',
    cardText: '#0F172A',
    accentColor: '#4F46E5',
    fontStyle: 'modern',
    showInnerBorder: true,
  },
  'arch-luxury': {
    label: 'Arch Luxury',
    cardBg: '#FCFAF6',
    cardText: '#44341B',
    accentColor: '#B48D39',
    fontStyle: 'luxury-serif',
    showInnerBorder: true,
  },
  'bold-dark': {
    label: 'Midnight Slate',
    cardBg: '#0F172A',
    cardText: '#F8FAFC',
    accentColor: '#38BDF8',
    fontStyle: 'modern',
    showInnerBorder: true,
  },
  'business-standee': {
    label: 'Table Standee',
    cardBg: '#F8FAFC',
    cardText: '#1E293B',
    accentColor: '#0D9488',
    fontStyle: 'editorial',
    showInnerBorder: false,
  },
};

export const INITIAL_STUDIO_STATE: StudioState = {
  content: {
    type: 'url',
    url: {
      link: 'https://example.com',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      useUtm: false,
    },
    text: 'Welcome! Scan this QR code for instant details.',
    wifi: {
      ssid: 'Studio_Guest_5G',
      password: 'Welcome2026',
      encryption: 'WPA',
      hidden: false,
    },
    vcard: {
      firstName: 'Alex',
      lastName: 'Morgan',
      organization: 'Studio Craft',
      title: 'Product Designer',
      phone: '+1 555 234 5678',
      email: 'alex@example.com',
      website: 'https://example.com',
      address: '120 Market St, San Francisco, CA',
    },
    whatsapp: {
      phone: '+15552345678',
      message: 'Hi! I scanned your QR code.',
    },
    email: {
      to: 'hello@example.com',
      subject: 'Hello from your QR Code',
      body: 'Hi there,',
    },
    phone: '+15552345678',
    sms: {
      phone: '+15552345678',
      message: 'Hello!',
    },
    location: {
      latitude: '37.7749',
      longitude: '-122.4194',
    },
  },
  qr: {
    shape: 'square',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    roundSize: true,
    dotsFill: {
      mode: 'linear',
      color1: '#312E81',
      color2: '#4F46E5',
      rotation: 135,
    },
    customCorners: true,
    cornerSquareColor: '#312E81',
    cornerDotColor: '#6366F1',
    backgroundTransparent: false,
    backgroundFill: {
      mode: 'solid',
      color1: '#FFFFFF',
      color2: '#F8FAFC',
      rotation: 135,
    },
    backgroundRound: 0,
    margin: 10,
    errorCorrectionLevel: 'H',
    typeNumber: 0,
  },
  logo: {
    mode: 'icon',
    iconId: 'link',
    iconColor: '#4F46E5',
    monogramText: 'QR',
    monogramBg: '#EEF2FF',
    monogramColor: '#312E81',
    uploadedDataUrl: '',
    imageSize: 0.3,
    imageMargin: 5,
    hideBackgroundDots: true,
    badgeShape: 'circle',
    badgeBg: '#FFFFFF',
  },
  stageMode: 'qr',
  frame: {
    style: 'bottom-pill',
    ctaText: 'SCAN ME',
    frameColor: '#FFFFFF',
    textColor: '#FFFFFF',
    accentColor: '#4F46E5',
    borderRadius: 24,
  },
  card: {
    template: 'modern-minimal',
    aspect: '5/7',
    fontStyle: 'modern',
    eyebrow: 'Quick Access',
    heading: 'Scan to Connect',
    subtitle: 'Point your phone camera here to open the link directly on your device',
    footer: 'Instant Access • Powered by QRBTA',
    showEncodedHint: true,
    cardBg: '#FFFFFF',
    cardText: '#0F172A',
    accentColor: '#4F46E5',
    showInnerBorder: true,
    showScanBadge: true,
    scanBadgeText: 'Scan to Open',
  },
};

export interface QuickStarter {
  id: string;
  label: string;
  apply: (prev: StudioState) => StudioState;
}

export const QUICK_STARTERS: QuickStarter[] = [
  {
    id: 'website',
    label: 'Website / Portfolio',
    apply: (prev) => ({
      ...prev,
      content: {
        ...prev.content,
        type: 'url',
        url: { ...prev.content.url, link: 'https://yourbrand.com' },
      },
      logo: { ...prev.logo, mode: 'icon', iconId: 'globe' },
      frame: { ...prev.frame, ctaText: 'VISIT SITE' },
      card: {
        ...prev.card,
        eyebrow: 'Official Link',
        heading: 'Visit Us Online',
        subtitle: 'Scan with your smartphone camera to explore our website and latest releases',
      },
    }),
  },
  {
    id: 'wifi',
    label: 'Guest Wi-Fi Sign',
    apply: (prev) => ({
      ...prev,
      content: {
        ...prev.content,
        type: 'wifi',
      },
      logo: { ...prev.logo, mode: 'icon', iconId: 'wifi' },
      frame: { ...prev.frame, ctaText: 'JOIN WI-FI' },
      card: {
        ...prev.card,
        eyebrow: 'Complimentary Wi-Fi',
        heading: 'Connect Instantly',
        subtitle: 'Scan the code to join our high-speed wireless network with one tap',
      },
    }),
  },
  {
    id: 'menu',
    label: 'Digital Menu',
    apply: (prev) => ({
      ...prev,
      content: {
        ...prev.content,
        type: 'url',
        url: { ...prev.content.url, link: 'https://menu.example.com' },
      },
      logo: { ...prev.logo, mode: 'icon', iconId: 'coffee' },
      frame: { ...prev.frame, ctaText: 'VIEW MENU' },
      card: {
        ...prev.card,
        template: 'business-standee',
        cardBg: '#F8FAFC',
        cardText: '#1E293B',
        accentColor: '#0D9488',
        eyebrow: 'Table Service',
        heading: 'Digital Menu',
        subtitle: 'Scan to browse today’s dishes, drinks, and seasonal specials',
      },
    }),
  },
  {
    id: 'event-luxury',
    label: 'Luxury Event / Wedding',
    apply: (prev) => ({
      ...prev,
      qr: {
        ...prev.qr,
        dotType: 'classy-rounded',
        dotsFill: { mode: 'linear', color1: '#5E481B', color2: '#A47D2E', rotation: 135 },
        customCorners: true,
        cornerSquareColor: '#5E481B',
        cornerDotColor: '#B48D39',
        backgroundFill: { mode: 'solid', color1: '#FCFAF6', color2: '#FCFAF6', rotation: 0 },
        backgroundTransparent: false,
      },
      logo: { ...prev.logo, mode: 'icon', iconId: 'rings', iconColor: '#B48D39' },
      stageMode: 'card',
      card: {
        ...prev.card,
        template: 'arch-luxury',
        fontStyle: 'luxury-serif',
        cardBg: '#FCFAF6',
        cardText: '#44341B',
        accentColor: '#B48D39',
        showInnerBorder: true,
        eyebrow: 'Save the Date',
        heading: 'Celebrate with Us',
        subtitle: 'Scan camera here for RSVP, event schedule & digital guestbook',
        footer: 'Forever & Always',
        scanBadgeText: 'Scan to View',
      },
    }),
  },
];
