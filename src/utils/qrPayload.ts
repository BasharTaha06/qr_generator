import { ContentState, LogoConfig } from '../types';

function escapeWifiField(val: string): string {
  return val.replace(/([\\;,:"])/g, '\\$1');
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return 'https://example.com';
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function buildUrlWithUtm(urlConfig: ContentState['url']): string {
  const base = normalizeUrl(urlConfig.link);
  if (!urlConfig.useUtm) return base;
  try {
    const parsed = new URL(base);
    if (urlConfig.utmSource.trim()) parsed.searchParams.set('utm_source', urlConfig.utmSource.trim());
    if (urlConfig.utmMedium.trim()) parsed.searchParams.set('utm_medium', urlConfig.utmMedium.trim());
    if (urlConfig.utmCampaign.trim()) parsed.searchParams.set('utm_campaign', urlConfig.utmCampaign.trim());
    return parsed.toString();
  } catch {
    return base;
  }
}

export function buildQrPayload(content: ContentState): string {
  switch (content.type) {
    case 'url':
      return buildUrlWithUtm(content.url);

    case 'text':
      return content.text.trim() || 'Hello from QRBTA';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = content.wifi;
      const safeSsid = escapeWifiField(ssid.trim() || 'Guest_WiFi');
      const safePass = encryption === 'nopass' ? '' : escapeWifiField(password);
      return `WIFI:T:${encryption};S:${safeSsid};P:${safePass};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'vcard': {
      const v = content.vcard;
      const fullName = `${v.firstName} ${v.lastName}`.trim() || 'Alex Morgan';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName.trim()};${v.firstName.trim()};;;`,
        `FN:${fullName}`,
      ];
      if (v.organization.trim()) lines.push(`ORG:${v.organization.trim()}`);
      if (v.title.trim()) lines.push(`TITLE:${v.title.trim()}`);
      if (v.phone.trim()) lines.push(`TEL;TYPE=CELL:${v.phone.trim()}`);
      if (v.email.trim()) lines.push(`EMAIL:${v.email.trim()}`);
      if (v.website.trim()) lines.push(`URL:${normalizeUrl(v.website)}`);
      if (v.address.trim()) lines.push(`ADR;TYPE=WORK:;;${v.address.trim()};;;;`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'whatsapp': {
      const digits = content.whatsapp.phone.replace(/[^\d]/g, '') || '15551234567';
      const msg = content.whatsapp.message.trim();
      return msg
        ? `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/${digits}`;
    }

    case 'email': {
      const to = content.email.to.trim() || 'hello@example.com';
      const params = new URLSearchParams();
      if (content.email.subject.trim()) params.set('subject', content.email.subject.trim());
      if (content.email.body.trim()) params.set('body', content.email.body.trim());
      const query = params.toString();
      return query ? `mailto:${to}?${query}` : `mailto:${to}`;
    }

    case 'phone': {
      const tel = content.phone.trim() || '+15551234567';
      return `tel:${tel.replace(/\s+/g, '')}`;
    }

    case 'sms': {
      const num = content.sms.phone.trim() || '+15551234567';
      const body = content.sms.message.trim();
      return body ? `SMSTO:${num}:${body}` : `SMSTO:${num}`;
    }

    case 'location': {
      const lat = content.location.latitude.trim() || '40.7128';
      const lng = content.location.longitude.trim() || '-74.0060';
      return `geo:${lat},${lng}`;
    }

    default:
      return 'https://example.com';
  }
}

export function getPayloadSummary(content: ContentState): string {
  switch (content.type) {
    case 'url':
      return content.url.link.replace(/^https?:\/\//i, '').slice(0, 42) || 'example.com';
    case 'text':
      return content.text.slice(0, 36) || 'Plain Text';
    case 'wifi':
      return `Wi-Fi: ${content.wifi.ssid || 'Network'}`;
    case 'vcard':
      return `${content.vcard.firstName} ${content.vcard.lastName}`.trim() || 'Contact Card';
    case 'whatsapp':
      return `WhatsApp: ${content.whatsapp.phone || 'Chat'}`;
    case 'email':
      return content.email.to || 'Email';
    case 'phone':
      return content.phone || 'Phone Call';
    case 'sms':
      return `SMS: ${content.sms.phone || 'Message'}`;
    case 'location':
      return `${content.location.latitude}, ${content.location.longitude}`;
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [rs, gs, bs] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = getRelativeLuminance(fgHex);
  const l2 = getRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getScanabilityFeedback(
  fgHex: string,
  bgHex: string,
  isTransparentBg: boolean
): {
  ratio: number;
  label: string;
  tone: 'emerald' | 'amber' | 'rose';
  invertedWarning: boolean;
} {
  if (isTransparentBg) {
    return {
      ratio: 0,
      label: 'Transparent BG — ensure dark/light contrast where placed',
      tone: 'amber',
      invertedWarning: false,
    };
  }

  const fgLum = getRelativeLuminance(fgHex);
  const bgLum = getRelativeLuminance(bgHex);
  const ratio = getContrastRatio(fgHex, bgHex);
  const invertedWarning = fgLum > bgLum + 0.15;

  if (ratio < 3) {
    return {
      ratio,
      label: `Low contrast (${ratio.toFixed(1)}:1) — scanners may struggle`,
      tone: 'rose',
      invertedWarning,
    };
  }
  if (ratio < 4.5 || invertedWarning) {
    return {
      ratio,
      label: invertedWarning
        ? `Inverted QR (${ratio.toFixed(1)}:1) — some older cameras prefer dark-on-light`
        : `Moderate contrast (${ratio.toFixed(1)}:1)`,
      tone: 'amber',
      invertedWarning,
    };
  }
  return {
    ratio,
    label: `Crisp scanability (${ratio.toFixed(1)}:1)`,
    tone: 'emerald',
    invertedWarning: false,
  };
}

export function buildCenterLogoDataUrl(
  logo: LogoConfig,
  iconSvgInnerHtml?: string
): string | undefined {
  if (logo.mode === 'none') return undefined;

  if (logo.mode === 'upload') {
    return logo.uploadedDataUrl || undefined;
  }

  if (logo.mode === 'monogram') {
    const label = (logo.monogramText || 'QR').slice(0, 5);
    const rx = logo.badgeShape === 'circle' ? 50 : logo.badgeShape === 'rounded' ? 22 : 14;
    const fontSize = label.length <= 2 ? 34 : label.length === 3 ? 28 : 22;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="140" height="140">
        <rect x="4" y="4" width="92" height="92" rx="${rx}" fill="${logo.monogramBg}" stroke="${logo.monogramColor}" stroke-width="4" stroke-opacity="0.22"/>
        <text x="50" y="54" font-family="'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif" font-weight="800" font-size="${fontSize}" fill="${logo.monogramColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-0.5">${escapeXml(label)}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  if (logo.mode === 'icon' && iconSvgInnerHtml) {
    const hasBadge = logo.badgeShape !== 'none';
    const rx = logo.badgeShape === 'circle' ? 50 : 22;
    const badgeLayer = hasBadge
      ? `<rect x="2" y="2" width="96" height="96" rx="${rx}" fill="${logo.badgeBg}" />`
      : '';
    const iconScale = hasBadge ? 'translate(22, 22) scale(2.33)' : 'translate(10, 10) scale(3.33)';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="140" height="140">
        ${badgeLayer}
        <g transform="${iconScale}" color="${logo.iconColor}">
          ${iconSvgInnerHtml}
        </g>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  return undefined;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
