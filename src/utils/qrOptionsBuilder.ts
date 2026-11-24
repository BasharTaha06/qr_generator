import type { Options, TypeNumber } from 'qr-code-styling';
import { CENTER_ICONS } from '../data/presets';
import { GradientConfig, StudioState } from '../types';
import { buildCenterLogoDataUrl, buildQrPayload } from './qrPayload';

function toQrGradient(cfg: GradientConfig) {
  if (cfg.mode === 'solid') return undefined;
  return {
    type: cfg.mode as 'linear' | 'radial',
    rotation: (cfg.rotation * Math.PI) / 180,
    colorStops: [
      { offset: 0, color: cfg.color1 },
      { offset: 1, color: cfg.color2 },
    ],
  };
}

export function buildQrStylingOptions(
  state: StudioState,
  size = 280,
  renderType: 'svg' | 'canvas' = 'svg'
): Options {
  const payload = buildQrPayload(state.content);
  const { qr, logo } = state;

  const iconDef = CENTER_ICONS.find((ic) => ic.id === logo.iconId);
  const logoImage = buildCenterLogoDataUrl(logo, iconDef?.svgInner);

  const dotsGradient = toQrGradient(qr.dotsFill);
  const bgGradient = qr.backgroundTransparent ? undefined : toQrGradient(qr.backgroundFill);

  const cornerSquareColor = qr.customCorners ? qr.cornerSquareColor : qr.dotsFill.color1;
  const cornerDotColor = qr.customCorners ? qr.cornerDotColor : qr.dotsFill.color1;

  return {
    width: size,
    height: size,
    type: renderType,
    shape: qr.shape,
    data: payload,
    margin: qr.margin,
    image: logoImage,
    qrOptions: {
      typeNumber: qr.typeNumber as TypeNumber,
      mode: 'Byte',
      errorCorrectionLevel: qr.errorCorrectionLevel,
    },
    imageOptions: {
      hideBackgroundDots: logo.hideBackgroundDots,
      imageSize: logo.imageSize,
      margin: logo.imageMargin,
      crossOrigin: 'anonymous',
      saveAsBlob: false,
    },
    dotsOptions: {
      type: qr.dotType,
      color: qr.dotsFill.color1,
      gradient: dotsGradient,
      roundSize: qr.roundSize,
    },
    cornersSquareOptions: {
      type: qr.cornerSquareType,
      color: cornerSquareColor,
      gradient: !qr.customCorners ? dotsGradient : undefined,
    },
    cornersDotOptions: {
      type: qr.cornerDotType,
      color: cornerDotColor,
      gradient: !qr.customCorners ? dotsGradient : undefined,
    },
    backgroundOptions: {
      round: qr.backgroundRound,
      color: qr.backgroundTransparent ? 'transparent' : qr.backgroundFill.color1,
      gradient: bgGradient,
    },
  };
}
