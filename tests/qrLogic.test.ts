import assert from 'node:assert/strict';
import { INITIAL_STUDIO_STATE, CENTER_ICONS } from '../src/data/presets.ts';
import {
  buildQrPayload,
  buildCenterLogoDataUrl,
  getContrastRatio,
  getScanabilityFeedback,
  normalizeUrl,
} from '../src/utils/qrPayload.ts';
import { buildQrStylingOptions } from '../src/utils/qrOptionsBuilder.ts';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL: ${name}`, err);
  }
}

test('normalizeUrl prepends https:// when scheme is missing', () => {
  assert.equal(normalizeUrl('example.com/path'), 'https://example.com/path');
  assert.equal(normalizeUrl('http://localhost:3000'), 'http://localhost:3000');
  assert.equal(normalizeUrl('   '), 'https://example.com');
});

test('buildQrPayload builds URL with optional UTM parameters', () => {
  const base = structuredClone(INITIAL_STUDIO_STATE.content);
  base.type = 'url';
  base.url.link = 'mybrand.io/menu';
  assert.equal(buildQrPayload(base), 'https://mybrand.io/menu');

  base.url.useUtm = true;
  base.url.utmSource = 'flyer';
  base.url.utmMedium = 'qr';
  base.url.utmCampaign = 'spring';
  assert.equal(
    buildQrPayload(base),
    'https://mybrand.io/menu?utm_source=flyer&utm_medium=qr&utm_campaign=spring'
  );
});

test('buildQrPayload builds escaped Wi-Fi, vCard, WhatsApp, Email, SMS, and Geo strings', () => {
  const content = structuredClone(INITIAL_STUDIO_STATE.content);

  content.type = 'wifi';
  content.wifi = { ssid: 'Cafe;Guest', password: 'pass:word', encryption: 'WPA', hidden: true };
  assert.equal(buildQrPayload(content), 'WIFI:T:WPA;S:Cafe\\;Guest;P:pass\\:word;H:true;;');

  content.type = 'vcard';
  const vcard = buildQrPayload(content);
  assert.match(vcard, /^BEGIN:VCARD\nVERSION:3\.0/);
  assert.match(vcard, /FN:Alex Morgan/);
  assert.match(vcard, /END:VCARD$/);

  content.type = 'whatsapp';
  content.whatsapp = { phone: '+1 (555) 123-4567', message: 'Hello world' };
  assert.equal(buildQrPayload(content), 'https://wa.me/15551234567?text=Hello%20world');

  content.type = 'location';
  content.location = { latitude: '30.0444', longitude: '31.2357' };
  assert.equal(buildQrPayload(content), 'geo:30.0444,31.2357');
});

test('contrast & scanability checks detect strong vs weak contrast', () => {
  assert.ok(getContrastRatio('#000000', '#FFFFFF') > 20);
  assert.equal(getScanabilityFeedback('#0F172A', '#FFFFFF', false).tone, 'emerald');
  assert.equal(getScanabilityFeedback('#E2E8F0', '#FFFFFF', false).tone, 'rose');
  assert.equal(getScanabilityFeedback('#38BDF8', '#0F172A', false).invertedWarning, true);
  assert.equal(getScanabilityFeedback('#0F172A', '#FFFFFF', true).tone, 'amber');
});

test('buildCenterLogoDataUrl generates SVG data URLs for icons and monograms', () => {
  const icon = CENTER_ICONS[0];
  const iconDataUrl = buildCenterLogoDataUrl(INITIAL_STUDIO_STATE.logo, icon.svgInner);
  assert.ok(iconDataUrl?.startsWith('data:image/svg+xml;charset=utf-8,'));

  const monogramUrl = buildCenterLogoDataUrl({
    ...INITIAL_STUDIO_STATE.logo,
    mode: 'monogram',
    monogramText: 'VIP',
  });
  assert.ok(monogramUrl?.includes('VIP'));

  const noneUrl = buildCenterLogoDataUrl({ ...INITIAL_STUDIO_STATE.logo, mode: 'none' });
  assert.equal(noneUrl, undefined);
});

test('buildQrStylingOptions configures gradients, custom corners, and transparent bg', () => {
  const opts = buildQrStylingOptions(INITIAL_STUDIO_STATE, 4096, 'canvas');
  assert.equal(opts.width, 4096);
  assert.equal(opts.type, 'canvas');
  assert.equal(opts.dotsOptions?.gradient?.type, 'linear');
  assert.equal(opts.cornersSquareOptions?.color, '#312E81');
  assert.equal(opts.imageOptions?.saveAsBlob, false);

  const transparentState = structuredClone(INITIAL_STUDIO_STATE);
  transparentState.qr.backgroundTransparent = true;
  const transparentOpts = buildQrStylingOptions(transparentState, 1200, 'svg');
  assert.equal(transparentOpts.backgroundOptions?.color, 'transparent');
  assert.equal(transparentOpts.backgroundOptions?.gradient, undefined);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
