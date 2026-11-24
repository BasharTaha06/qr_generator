export type ContentType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'sms'
  | 'location';

export type DotStyle =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'extra-rounded'
  | 'classy'
  | 'classy-rounded';

export type CornerSquareStyle = 'square' | 'dot' | 'extra-rounded';
export type CornerDotStyle = 'square' | 'dot';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type QrShape = 'square' | 'circle';
export type ColorFillMode = 'solid' | 'linear' | 'radial';

export type LogoMode = 'none' | 'icon' | 'monogram' | 'upload';
export type LogoBadgeShape = 'none' | 'circle' | 'rounded';

export type PreviewStageMode = 'qr' | 'card';
export type FrameStyle =
  | 'none'
  | 'bottom-pill'
  | 'banner'
  | 'polaroid'
  | 'dark-neon'
  | 'outlined';

export type CardTemplate = 'arch-luxury' | 'modern-minimal' | 'bold-dark' | 'business-standee';
export type CardAspect = '5/7' | '1/1' | '4/5';
export type CardFontStyle = 'modern' | 'luxury-serif' | 'editorial' | 'cinzel';

export interface ContentState {
  type: ContentType;
  url: {
    link: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    useUtm: boolean;
  };
  text: string;
  wifi: {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden: boolean;
  };
  vcard: {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  whatsapp: {
    phone: string;
    message: string;
  };
  email: {
    to: string;
    subject: string;
    body: string;
  };
  phone: string;
  sms: {
    phone: string;
    message: string;
  };
  location: {
    latitude: string;
    longitude: string;
  };
}

export interface GradientConfig {
  mode: ColorFillMode;
  color1: string;
  color2: string;
  rotation: number; // degrees 0-360
}

export interface QrStyleConfig {
  shape: QrShape;
  dotType: DotStyle;
  cornerSquareType: CornerSquareStyle;
  cornerDotType: CornerDotStyle;
  roundSize: boolean;
  dotsFill: GradientConfig;
  customCorners: boolean;
  cornerSquareColor: string;
  cornerDotColor: string;
  backgroundTransparent: boolean;
  backgroundFill: GradientConfig;
  backgroundRound: number; // 0 to 1
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  typeNumber: number; // 0 = auto
}

export interface LogoConfig {
  mode: LogoMode;
  iconId: string;
  iconColor: string;
  monogramText: string;
  monogramBg: string;
  monogramColor: string;
  uploadedDataUrl: string;
  imageSize: number; // 0.15 - 0.45
  imageMargin: number; // 0 - 20
  hideBackgroundDots: boolean;
  badgeShape: LogoBadgeShape;
  badgeBg: string;
}

export interface FrameConfig {
  style: FrameStyle;
  ctaText: string;
  frameColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
}

export interface CardConfig {
  template: CardTemplate;
  aspect: CardAspect;
  fontStyle: CardFontStyle;
  eyebrow: string;
  heading: string;
  subtitle: string;
  footer: string;
  showEncodedHint: boolean;
  cardBg: string;
  cardText: string;
  accentColor: string;
  showInnerBorder: boolean;
  showScanBadge: boolean;
  scanBadgeText: string;
}

export interface StudioState {
  content: ContentState;
  qr: QrStyleConfig;
  logo: LogoConfig;
  stageMode: PreviewStageMode;
  frame: FrameConfig;
  card: CardConfig;
}

export interface SavedDesign {
  id: string;
  name: string;
  createdAt: number;
  previewLabel: string;
  state: StudioState;
}
