import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  Camera,
  Check,
  Copy,
  Download,
  FileCode2,
  FileText,
  Frame,
  Image as ImageIcon,
  Layers,
  Printer,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { StudioState } from '../types';
import { buildQrStylingOptions } from '../utils/qrOptionsBuilder';
import { getPayloadSummary } from '../utils/qrPayload';

interface PreviewAndExportProps {
  state: StudioState;
  onUpdateStageMode: (mode: 'qr' | 'card') => void;
  onNotify: (message: string) => void;
}

type StageBackdrop = 'light' | 'slate' | 'dark' | 'checker';
type ExportResolution = 512 | 1024 | 2048 | 4096;
type RasterFormat = 'png' | 'jpeg' | 'webp';

export const PreviewAndExport: React.FC<PreviewAndExportProps> = ({
  state,
  onUpdateStageMode,
  onNotify,
}) => {
  const qrMountRef = useRef<HTMLDivElement | null>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);

  const [backdrop, setBackdrop] = useState<StageBackdrop>('slate');
  const [resolution, setResolution] = useState<ExportResolution>(2048);
  const [rasterFormat, setRasterFormat] = useState<RasterFormat>('png');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [copiedPng, setCopiedPng] = useState(false);

  // Mount & live-update SVG QR engine
  useEffect(() => {
    const container = qrMountRef.current;
    if (!container) return;

    const opts = buildQrStylingOptions(state, 260, 'svg');
    if (!qrInstanceRef.current) {
      container.innerHTML = '';
      const instance = new QRCodeStyling(opts);
      instance.append(container);
      qrInstanceRef.current = instance;
    } else {
      qrInstanceRef.current.update(opts);
    }
  }, [state]);

  const fileSlug = (() => {
    const summary = getPayloadSummary(state.content)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 28);
    return summary || 'qr-code';
  })();

  const exportVectorSvg = async () => {
    setBusyAction('svg');
    try {
      const exporter = new QRCodeStyling(buildQrStylingOptions(state, 1200, 'svg'));
      await exporter.download({ name: `${fileSlug}-vector`, extension: 'svg' });
      onNotify('Vector SVG exported (infinite resolution)');
    } catch (err) {
      console.error(err);
      onNotify('Could not export Vector SVG');
    } finally {
      setBusyAction(null);
    }
  };

  const exportRasterQr = async () => {
    setBusyAction('raster');
    try {
      const exporter = new QRCodeStyling(buildQrStylingOptions(state, resolution, 'canvas'));
      await exporter.download({
        name: `${fileSlug}-${resolution}px`,
        extension: rasterFormat,
      });
      onNotify(`Downloaded ${resolution}×${resolution}px ${rasterFormat.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      onNotify('Could not export image');
    } finally {
      setBusyAction(null);
    }
  };

  const copyQrToClipboard = async () => {
    if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
      onNotify('Clipboard image copy is not supported in this browser');
      return;
    }
    setBusyAction('copy');
    try {
      const exporter = new QRCodeStyling(buildQrStylingOptions(state, 1024, 'canvas'));
      const raw = await exporter.getRawData('png');
      if (raw instanceof Blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': raw })]);
        setCopiedPng(true);
        setTimeout(() => setCopiedPng(false), 2000);
        onNotify('1024px PNG copied to clipboard!');
      }
    } catch (err) {
      console.error(err);
      onNotify('Clipboard copy blocked — try Download PNG instead');
    } finally {
      setBusyAction(null);
    }
  };

  const exportStagePng = async () => {
    if (!captureRef.current) return;
    setBusyAction('stage-png');
    try {
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 3.5,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${fileSlug}-${state.stageMode === 'card' ? 'printable-card' : 'framed-qr'}.png`;
      link.href = dataUrl;
      link.click();
      onNotify('High-DPI PNG downloaded (300 DPI ready)');
    } catch (err) {
      console.error(err);
      onNotify('Could not render framed PNG');
    } finally {
      setBusyAction(null);
    }
  };

  const exportStagePdf = async () => {
    if (!captureRef.current) return;
    setBusyAction('pdf');
    try {
      const rect = captureRef.current.getBoundingClientRect();
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 3.5,
        cacheBust: true,
      });
      const pdf = new jsPDF({
        orientation: rect.width >= rect.height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const maxW = pageW - 24;
      const maxH = pageH - 24;
      const ratio = Math.min(maxW / rect.width, maxH / rect.height);
      const drawW = rect.width * ratio;
      const drawH = rect.height * ratio;
      const x = (pageW - drawW) / 2;
      const y = (pageH - drawH) / 2;
      pdf.addImage(dataUrl, 'PNG', x, y, drawW, drawH);
      pdf.save(`${fileSlug}-${state.stageMode}.pdf`);
      onNotify('Print-ready A4 PDF downloaded!');
    } catch (err) {
      console.error(err);
      onNotify('Could not export PDF');
    } finally {
      setBusyAction(null);
    }
  };

  const stageBgClass =
    backdrop === 'light'
      ? 'bg-white'
      : backdrop === 'slate'
      ? 'bg-slate-100'
      : backdrop === 'dark'
      ? 'bg-slate-900'
      : 'checkerboard-bg';

  const { frame, card, stageMode } = state;

  const cardFontClasses = (() => {
    switch (card.fontStyle) {
      case 'luxury-serif':
        return {
          eyebrow: 'font-script text-3xl sm:text-4xl',
          heading: 'font-serif text-2xl sm:text-3xl font-semibold tracking-wider uppercase',
          subtitle: 'font-sans text-[11px] tracking-wide uppercase',
          footer: 'font-serif italic text-sm',
        };
      case 'editorial':
        return {
          eyebrow: 'font-sans text-[11px] font-bold tracking-[0.22em] uppercase',
          heading: 'font-display text-2xl sm:text-3xl font-bold tracking-tight',
          subtitle: 'font-sans text-xs leading-relaxed',
          footer: 'font-sans text-xs font-semibold tracking-wider uppercase',
        };
      case 'cinzel':
        return {
          eyebrow: 'font-cinzel text-xs font-bold tracking-[0.25em] uppercase',
          heading: 'font-cinzel text-xl sm:text-2xl font-bold tracking-wider uppercase',
          subtitle: 'font-serif text-sm',
          footer: 'font-cinzel text-[11px] tracking-widest uppercase',
        };
      default:
        return {
          eyebrow: 'font-modern text-xs font-bold tracking-[0.18em] uppercase',
          heading: 'font-modern text-2xl sm:text-3xl font-bold tracking-tight',
          subtitle: 'font-sans text-xs leading-relaxed',
          footer: 'font-sans text-[11px] font-semibold tracking-wide',
        };
    }
  })();

  const cardAspectClass =
    card.aspect === '1/1'
      ? 'aspect-square max-w-[410px]'
      : card.aspect === '4/5'
      ? 'aspect-[4/5] max-w-[395px]'
      : 'aspect-[5/7] max-w-[385px]';

  const hasFrameOrCard = stageMode === 'card' || frame.style !== 'none';

  return (
    <div className="space-y-4">
      {/* Stage Top Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onUpdateStageMode('qr')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              stageMode === 'qr'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Frame className="w-3.5 h-3.5" />
            QR &amp; Frame
          </button>
          <button
            type="button"
            onClick={() => onUpdateStageMode('card')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              stageMode === 'card'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Printable Card
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 mr-1">Stage:</span>
          {(
            [
              { id: 'light', label: 'White', dot: 'bg-white border-slate-300' },
              { id: 'slate', label: 'Soft', dot: 'bg-slate-200 border-slate-300' },
              { id: 'dark', label: 'Dark', dot: 'bg-slate-900 border-slate-700' },
              { id: 'checker', label: 'Alpha', dot: 'checkerboard-bg border-slate-300' },
            ] as { id: StageBackdrop; label: string; dot: string }[]
          ).map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setBackdrop(bg.id)}
              title={`${bg.label} backdrop`}
              className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition ${
                backdrop === bg.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full border ${bg.dot}`} />
              <span className="hidden sm:inline">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview Stage */}
      <div
        className={`print-stage rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[420px] transition-colors ${stageBgClass}`}
      >
        <div id="exportCaptureTarget" ref={captureRef} className="inline-flex justify-center w-full">
          {stageMode === 'qr' ? (
            <FramedQrWrapper frame={frame}>
              <div
                ref={qrMountRef}
                className="qr-svg-host w-[235px] h-[235px] sm:w-[260px] sm:h-[260px] flex items-center justify-center"
              />
            </FramedQrWrapper>
          ) : (
            <div
              className={`relative w-full ${cardAspectClass} shadow-2xl p-7 sm:p-8 flex flex-col items-center justify-between text-center select-none overflow-hidden rounded-3xl transition-all duration-300`}
              style={{ backgroundColor: card.cardBg, color: card.cardText }}
            >
              {/* Decorative Inner Border */}
              {card.showInnerBorder && (
                <div
                  className={`absolute inset-3.5 pointer-events-none border transition-all duration-300 ${
                    card.template === 'arch-luxury' ? 'arch-shape' : 'rounded-2xl'
                  }`}
                  style={{ borderColor: `${card.accentColor}55` }}
                />
              )}

              {/* Card Top Section */}
              <div className="relative z-10 w-full pt-2 flex flex-col items-center">
                {card.eyebrow && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-6 h-[1px] opacity-30" style={{ backgroundColor: card.cardText }} />
                    <span className={cardFontClasses.eyebrow} style={{ color: card.accentColor }}>
                      {card.eyebrow}
                    </span>
                    <span className="w-6 h-[1px] opacity-30" style={{ backgroundColor: card.cardText }} />
                  </div>
                )}

                {card.heading && (
                  <h2 className={`${cardFontClasses.heading} mt-2.5 leading-tight`}>
                    {card.heading}
                  </h2>
                )}

                {card.subtitle && (
                  <p className={`${cardFontClasses.subtitle} opacity-75 max-w-[270px] mx-auto mt-2`}>
                    {card.subtitle}
                  </p>
                )}
              </div>

              {/* Card QR Section */}
              <div className="relative z-10 my-auto py-3 flex flex-col items-center">
                <div
                  className="p-2.5 bg-white rounded-2xl shadow-sm border relative"
                  style={{ borderColor: `${card.accentColor}30` }}
                >
                  <div
                    ref={qrMountRef}
                    className="qr-svg-host w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] flex items-center justify-center"
                  />

                  {card.showScanBadge && card.scanBadgeText && (
                    <div
                      className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-sans font-bold px-3 py-0.5 rounded-full tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap"
                      style={{ backgroundColor: card.accentColor }}
                    >
                      <QrCode className="w-2.5 h-2.5" />
                      {card.scanBadgeText}
                    </div>
                  )}
                </div>

                <p className="text-[10px] tracking-widest uppercase opacity-60 mt-4 flex items-center gap-1 font-sans">
                  <Camera className="w-3 h-3" />
                  Point camera at QR code
                </p>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 w-full pb-1 flex flex-col items-center">
                <div className="w-12 h-[1px] opacity-25 mb-2" style={{ backgroundColor: card.cardText }} />
                {card.footer && (
                  <p className={`${cardFontClasses.footer} opacity-85`}>{card.footer}</p>
                )}
                {card.showEncodedHint && (
                  <p className="font-mono text-[9px] tracking-wider opacity-55 mt-1 max-w-[260px] truncate">
                    {getPayloadSummary(state.content)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export & Download Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Export &amp; Print Studio
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            ECC {state.qr.errorCorrectionLevel} • {state.qr.shape === 'circle' ? 'Circular' : 'Square'}
          </span>
        </div>

        {/* Primary QR Exports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={busyAction !== null}
            onClick={exportVectorSvg}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition disabled:opacity-60"
          >
            <FileCode2 className="w-4 h-4 text-indigo-400" />
            <span>Vector SVG</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              Infinite
            </span>
          </button>

          <button
            type="button"
            disabled={busyAction !== null}
            onClick={copyQrToClipboard}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition disabled:opacity-60"
          >
            {copiedPng ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied PNG!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Copy QR Image</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Raster QR Size & Format */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-700">High-Resolution QR Export</span>
            <div className="flex items-center gap-1.5">
              <select
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value) as ExportResolution)}
                className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-mono font-medium"
              >
                <option value={512}>512 × 512 px</option>
                <option value={1024}>1K (1024 px)</option>
                <option value={2048}>2K (2048 px)</option>
                <option value={4096}>4K (4096 px • 300 DPI)</option>
              </select>
              <select
                value={rasterFormat}
                onChange={(e) => setRasterFormat(e.target.value as RasterFormat)}
                className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-semibold uppercase"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            disabled={busyAction !== null}
            onClick={exportRasterQr}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>
              Download {resolution}px {rasterFormat.toUpperCase()}
            </span>
          </button>
        </div>

        {/* Frame / Printable Card Exports */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              {state.stageMode === 'card'
                ? 'Printable Card Exports'
                : hasFrameOrCard
                ? 'Framed QR Exports'
                : 'Stage Snapshot & Print'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={busyAction !== null}
              onClick={exportStagePng}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{state.stageMode === 'card' ? 'Card PNG' : 'Framed PNG'}</span>
            </button>
            <button
              type="button"
              disabled={busyAction !== null}
              onClick={exportStagePdf}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Export PDF</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FramedQrWrapperProps {
  frame: StudioState['frame'];
  children: React.ReactNode;
}

const FramedQrWrapper: React.FC<FramedQrWrapperProps> = ({ frame, children }) => {
  if (frame.style === 'none') {
    return <div className="inline-block">{children}</div>;
  }

  if (frame.style === 'bottom-pill') {
    return (
      <div
        className="p-4 pb-5 shadow-xl border border-slate-200/80 flex flex-col items-center gap-3"
        style={{ backgroundColor: frame.frameColor, borderRadius: `${frame.borderRadius}px` }}
      >
        <div className="overflow-hidden rounded-xl">{children}</div>
        <div
          className="px-5 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-sm"
          style={{ backgroundColor: frame.accentColor, color: frame.textColor }}
        >
          {frame.ctaText || 'SCAN ME'}
        </div>
      </div>
    );
  }

  if (frame.style === 'banner') {
    return (
      <div
        className="shadow-xl overflow-hidden border border-slate-200/80 flex flex-col items-center"
        style={{ backgroundColor: frame.frameColor, borderRadius: `${frame.borderRadius}px` }}
      >
        <div
          className="w-full py-2.5 px-4 text-center text-xs font-extrabold tracking-[0.2em] uppercase"
          style={{ backgroundColor: frame.accentColor, color: frame.textColor }}
        >
          {frame.ctaText || 'SCAN ME'}
        </div>
        <div className="p-4">{children}</div>
      </div>
    );
  }

  if (frame.style === 'polaroid') {
    return (
      <div
        className="p-4 pb-6 shadow-xl border border-slate-200 flex flex-col items-center gap-3"
        style={{ backgroundColor: frame.frameColor, borderRadius: `${frame.borderRadius}px` }}
      >
        <div className="p-1.5 rounded-xl border border-slate-100 bg-white">{children}</div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 rounded-full" style={{ backgroundColor: frame.accentColor }} />
          <span
            className="text-xs font-extrabold tracking-[0.18em] uppercase"
            style={{ color: frame.accentColor }}
          >
            {frame.ctaText || 'SCAN ME'}
          </span>
          <span className="w-4 h-0.5 rounded-full" style={{ backgroundColor: frame.accentColor }} />
        </div>
      </div>
    );
  }

  if (frame.style === 'dark-neon') {
    return (
      <div
        className="p-4 pb-5 shadow-2xl flex flex-col items-center gap-3 border-2"
        style={{
          backgroundColor: '#0F172A',
          borderColor: frame.accentColor,
          borderRadius: `${frame.borderRadius}px`,
        }}
      >
        <div className="rounded-xl overflow-hidden bg-white p-1.5">{children}</div>
        <div
          className="px-4 py-1.5 rounded-xl text-xs font-extrabold tracking-[0.2em] uppercase"
          style={{ backgroundColor: frame.accentColor, color: frame.textColor }}
        >
          {frame.ctaText || 'SCAN ME'}
        </div>
      </div>
    );
  }

  // outlined
  return (
    <div
      className="relative p-4 pt-5 shadow-lg flex flex-col items-center border-[3px]"
      style={{
        backgroundColor: frame.frameColor,
        borderColor: frame.accentColor,
        borderRadius: `${frame.borderRadius}px`,
      }}
    >
      <div
        className="absolute -top-3.5 px-4 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase shadow-sm"
        style={{ backgroundColor: frame.accentColor, color: frame.textColor }}
      >
        {frame.ctaText || 'SCAN ME'}
      </div>
      <div>{children}</div>
    </div>
  );
};
