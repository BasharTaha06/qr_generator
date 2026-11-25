import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Frame,
  Image as ImageIcon,
  Layers,
  Palette,
  Shapes,
  Sliders,
  Trash2,
  Upload,
} from 'lucide-react';
import { CARD_TEMPLATE_PRESETS, CENTER_ICONS, QR_THEME_PRESETS } from '../data/presets';
import {
  CardAspect,
  CardFontStyle,
  CardTemplate,
  ColorFillMode,
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
  ErrorCorrectionLevel,
  FrameStyle,
  LogoBadgeShape,
  LogoMode,
  StudioState,
} from '../types';
import { getScanabilityFeedback } from '../utils/qrPayload';

interface DesignControlsProps {
  state: StudioState;
  onUpdate: (updater: (prev: StudioState) => StudioState) => void;
}

type DesignTab = 'colors' | 'geometry' | 'logo' | 'frame';

const DOT_STYLES: { id: DotStyle; label: string }[] = [
  { id: 'square', label: 'Sharp Square' },
  { id: 'rounded', label: 'Soft Rounded' },
  { id: 'dots', label: 'Circular Dots' },
  { id: 'extra-rounded', label: 'Fluid Pill' },
  { id: 'classy', label: 'Classy Cut' },
  { id: 'classy-rounded', label: 'Classy Fluid' },
];

const CORNER_SQUARE_STYLES: { id: CornerSquareStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'extra-rounded', label: 'Rounded' },
  { id: 'dot', label: 'Circle' },
];

const CORNER_DOT_STYLES: { id: CornerDotStyle; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
];

const FRAME_STYLES: { id: FrameStyle; label: string }[] = [
  { id: 'none', label: 'Clean QR' },
  { id: 'bottom-pill', label: 'Bottom Pill' },
  { id: 'banner', label: 'Scan Banner' },
  { id: 'polaroid', label: 'Tag Card' },
  { id: 'dark-neon', label: 'Dark Frame' },
  { id: 'outlined', label: 'Badge Border' },
];

export const DesignControls: React.FC<DesignControlsProps> = ({ state, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<DesignTab>('colors');

  const { qr, logo, frame, card, stageMode } = state;

  const scanFeedback = getScanabilityFeedback(
    qr.dotsFill.color1,
    qr.backgroundFill.color1,
    qr.backgroundTransparent
  );

  const applyThemePreset = (presetId: string) => {
    const preset = QR_THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onUpdate((prev) => ({
      ...prev,
      qr: {
        ...prev.qr,
        dotsFill: { ...preset.dotsFill },
        dotType: preset.dotType,
        cornerSquareType: preset.cornerSquareType,
        cornerDotType: preset.cornerDotType,
        customCorners: Boolean(preset.customCorners),
        cornerSquareColor: preset.cornerSquareColor ?? preset.dotsFill.color1,
        cornerDotColor: preset.cornerDotColor ?? preset.dotsFill.color1,
        backgroundTransparent: false,
        backgroundFill: {
          mode: 'solid',
          color1: preset.backgroundColor,
          color2: preset.backgroundColor,
          rotation: 0,
        },
      },
      logo: {
        ...prev.logo,
        iconColor: preset.accentColor,
        monogramColor: preset.dotsFill.color1,
      },
      frame: {
        ...prev.frame,
        accentColor: preset.accentColor,
      },
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) return;
      const probe = new Image();
      probe.onload = () => {
        onUpdate((prev) => ({
          ...prev,
          logo: {
            ...prev.logo,
            mode: 'upload',
            uploadedDataUrl: result,
          },
          qr: {
            ...prev.qr,
            errorCorrectionLevel: 'H',
          },
        }));
      };
      probe.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const tabs: { id: DesignTab; label: string; icon: React.ReactNode }[] = [
    { id: 'colors', label: 'Themes & Colors', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'geometry', label: 'Pattern & Spec', icon: <Shapes className="w-3.5 h-3.5" /> },
    { id: 'logo', label: 'Center Logo', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'frame', label: 'Frame & Card', icon: <Frame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition ${
                active
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: THEMES & COLORS */}
      {activeTab === 'colors' && (
        <div className="space-y-5">
          {/* Curated Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Curated Style Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QR_THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyThemePreset(preset.id)}
                  className="group p-2 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 text-left transition flex items-center gap-2"
                >
                  <div className="flex items-center -space-x-1.5 shrink-0">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                      style={{ backgroundColor: preset.backgroundColor }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-sm"
                      style={{
                        background:
                          preset.dotsFill.mode === 'solid'
                            ? preset.dotsFill.color1
                            : `linear-gradient(135deg, ${preset.dotsFill.color1}, ${preset.dotsFill.color2})`,
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-800 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[9px] text-slate-400">{preset.badge}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanability Guard */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
              scanFeedback.tone === 'emerald'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : scanFeedback.tone === 'amber'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {scanFeedback.tone === 'emerald' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{scanFeedback.label}</span>
          </div>

          {/* Foreground Color & Gradient */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Foreground Dots Fill</span>
              <div className="inline-flex rounded-lg bg-white border border-slate-200 p-0.5">
                {(['solid', 'linear', 'radial'] as ColorFillMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      onUpdate((prev) => ({
                        ...prev,
                        qr: { ...prev.qr, dotsFill: { ...prev.qr.dotsFill, mode } },
                      }))
                    }
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded-md capitalize transition ${
                      qr.dotsFill.mode === mode
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ColorField
                label={qr.dotsFill.mode === 'solid' ? 'Primary Color' : 'Gradient Start'}
                value={qr.dotsFill.color1}
                onChange={(color1) =>
                  onUpdate((prev) => ({
                    ...prev,
                    qr: { ...prev.qr, dotsFill: { ...prev.qr.dotsFill, color1 } },
                  }))
                }
              />
              {qr.dotsFill.mode !== 'solid' && (
                <ColorField
                  label="Gradient End"
                  value={qr.dotsFill.color2}
                  onChange={(color2) =>
                    onUpdate((prev) => ({
                      ...prev,
                      qr: { ...prev.qr, dotsFill: { ...prev.qr.dotsFill, color2 } },
                    }))
                  }
                />
              )}
            </div>

            {qr.dotsFill.mode === 'linear' && (
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Gradient Angle</span>
                  <span className="font-mono">{qr.dotsFill.rotation}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={qr.dotsFill.rotation}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      qr: {
                        ...prev.qr,
                        dotsFill: { ...prev.qr.dotsFill, rotation: Number(e.target.value) },
                      },
                    }))
                  }
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Custom Corner Eye Colors */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-700">
                Independent Corner Eye Colors
              </span>
              <input
                type="checkbox"
                checked={qr.customCorners}
                onChange={(e) =>
                  onUpdate((prev) => ({
                    ...prev,
                    qr: { ...prev.qr, customCorners: e.target.checked },
                  }))
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
            {qr.customCorners && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <ColorField
                  label="Corner Frame"
                  value={qr.cornerSquareColor}
                  onChange={(cornerSquareColor) =>
                    onUpdate((prev) => ({
                      ...prev,
                      qr: { ...prev.qr, cornerSquareColor },
                    }))
                  }
                />
                <ColorField
                  label="Corner Center Dot"
                  value={qr.cornerDotColor}
                  onChange={(cornerDotColor) =>
                    onUpdate((prev) => ({
                      ...prev,
                      qr: { ...prev.qr, cornerDotColor },
                    }))
                  }
                />
              </div>
            )}
          </div>

          {/* Background Color / Transparency */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">QR Background</span>
              <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={qr.backgroundTransparent}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      qr: { ...prev.qr, backgroundTransparent: e.target.checked },
                    }))
                  }
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Transparent
              </label>
            </div>

            {!qr.backgroundTransparent && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Fill Type</span>
                  <div className="inline-flex rounded-lg bg-white border border-slate-200 p-0.5">
                    {(['solid', 'linear', 'radial'] as ColorFillMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          onUpdate((prev) => ({
                            ...prev,
                            qr: {
                              ...prev.qr,
                              backgroundFill: { ...prev.qr.backgroundFill, mode },
                            },
                          }))
                        }
                        className={`px-2 py-0.5 text-[11px] font-semibold rounded-md capitalize transition ${
                          qr.backgroundFill.mode === mode
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ColorField
                    label="Background Color"
                    value={qr.backgroundFill.color1}
                    onChange={(color1) =>
                      onUpdate((prev) => ({
                        ...prev,
                        qr: {
                          ...prev.qr,
                          backgroundFill: { ...prev.qr.backgroundFill, color1 },
                        },
                      }))
                    }
                  />
                  {qr.backgroundFill.mode !== 'solid' && (
                    <ColorField
                      label="Background End"
                      value={qr.backgroundFill.color2}
                      onChange={(color2) =>
                        onUpdate((prev) => ({
                          ...prev,
                          qr: {
                            ...prev.qr,
                            backgroundFill: { ...prev.qr.backgroundFill, color2 },
                          },
                        }))
                      }
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PATTERN & TECHNICAL SPECS */}
      {activeTab === 'geometry' && (
        <div className="space-y-4">
          {/* QR Overall Shape */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">Overall QR Shape</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'square', label: 'Classic Square Matrix' },
                  { id: 'circle', label: 'Circular Badge QR' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onUpdate((prev) => ({ ...prev, qr: { ...prev.qr, shape: item.id } }))
                  }
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    qr.shape === item.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data Dot Patterns */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Data Modules (Dots)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DOT_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    onUpdate((prev) => ({ ...prev, qr: { ...prev.qr, dotType: style.id } }))
                  }
                  className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition ${
                    qr.dotType === style.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Finder Styles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Corner Outer Frame</label>
              <div className="grid grid-cols-3 gap-1.5">
                {CORNER_SQUARE_STYLES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      onUpdate((prev) => ({
                        ...prev,
                        qr: { ...prev.qr, cornerSquareType: c.id },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition ${
                      qr.cornerSquareType === c.id
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2">
              <label className="block text-xs font-bold text-slate-700">Corner Inner Pupil</label>
              <div className="grid grid-cols-2 gap-1.5">
                {CORNER_DOT_STYLES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      onUpdate((prev) => ({
                        ...prev,
                        qr: { ...prev.qr, cornerDotType: c.id },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition ${
                      qr.cornerDotType === c.id
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quiet Zone, Corner Radius & Tech Specs */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Precision &amp; Error Correction
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Quiet Zone Margin</span>
                <span className="font-mono font-semibold">{qr.margin}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={qr.margin}
                onChange={(e) =>
                  onUpdate((prev) => ({
                    ...prev,
                    qr: { ...prev.qr, margin: Number(e.target.value) },
                  }))
                }
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Background Corner Rounding</span>
                <span className="font-mono font-semibold">{Math.round(qr.backgroundRound * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.05}
                value={qr.backgroundRound}
                onChange={(e) =>
                  onUpdate((prev) => ({
                    ...prev,
                    qr: { ...prev.qr, backgroundRound: Number(e.target.value) },
                  }))
                }
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Error Correction
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() =>
                        onUpdate((prev) => ({
                          ...prev,
                          qr: { ...prev.qr, errorCorrectionLevel: lvl },
                        }))
                      }
                      className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                        qr.errorCorrectionLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  H (30%) recommended when using center logos.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Matrix Density (Version)
                </label>
                <select
                  value={qr.typeNumber}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      qr: { ...prev.qr, typeNumber: Number(e.target.value) },
                    }))
                  }
                  className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value={0}>Auto (Optimal Fit)</option>
                  {[2, 4, 6, 8, 10, 12, 15, 20].map((v) => (
                    <option key={v} value={v}>
                      Version {v} ({17 + v * 4}×{17 + v * 4})
                    </option>
                  ))}
                </select>
                <label className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qr.roundSize}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        qr: { ...prev.qr, roundSize: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  Snap pixel-crisp module sizes
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CENTER LOGO / EMBLEM */}
      {activeTab === 'logo' && (
        <div className="space-y-4">
          {/* Logo Mode */}
          <div className="grid grid-cols-4 gap-1.5">
            {(
              [
                { id: 'none', label: 'No Logo' },
                { id: 'icon', label: 'Icon Library' },
                { id: 'monogram', label: 'Text Badge' },
                { id: 'upload', label: 'Upload File' },
              ] as { id: LogoMode; label: string }[]
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  onUpdate((prev) => ({
                    ...prev,
                    logo: { ...prev.logo, mode: m.id },
                    qr:
                      m.id !== 'none'
                        ? { ...prev.qr, errorCorrectionLevel: 'H' }
                        : prev.qr,
                  }))
                }
                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition ${
                  logo.mode === m.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {logo.mode === 'icon' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {CENTER_ICONS.map((icon) => {
                  const active = logo.iconId === icon.id;
                  return (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() =>
                        onUpdate((prev) => ({
                          ...prev,
                          logo: { ...prev.logo, iconId: icon.id },
                        }))
                      }
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition ${
                        active
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        dangerouslySetInnerHTML={{ __html: icon.svgInner }}
                      />
                      <span className="text-[10px] font-medium truncate w-full text-center">
                        {icon.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                <ColorField
                  label="Icon Color"
                  value={logo.iconColor}
                  onChange={(iconColor) =>
                    onUpdate((prev) => ({ ...prev, logo: { ...prev.logo, iconColor } }))
                  }
                />
                <ColorField
                  label="Badge Backdrop"
                  value={logo.badgeBg}
                  onChange={(badgeBg) =>
                    onUpdate((prev) => ({ ...prev, logo: { ...prev.logo, badgeBg } }))
                  }
                />
              </div>
            </div>
          )}

          {logo.mode === 'monogram' && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Text / Initials (max 5 chars)
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={logo.monogramText}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      logo: { ...prev.logo, monogramText: e.target.value },
                    }))
                  }
                  placeholder="QR / VIP / A&P"
                  className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ColorField
                  label="Text Color"
                  value={logo.monogramColor}
                  onChange={(monogramColor) =>
                    onUpdate((prev) => ({ ...prev, logo: { ...prev.logo, monogramColor } }))
                  }
                />
                <ColorField
                  label="Badge Background"
                  value={logo.monogramBg}
                  onChange={(monogramBg) =>
                    onUpdate((prev) => ({ ...prev, logo: { ...prev.logo, monogramBg } }))
                  }
                />
              </div>
            </div>
          )}

          {logo.mode === 'upload' && (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-3">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  Upload Brand Logo (PNG, SVG, JPG, WebP)
                </span>
                <span className="text-[11px] text-slate-400">
                  Processed 100% locally in your browser — never uploaded anywhere.
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {logo.uploadedDataUrl && (
                <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-200">
                  <img
                    src={logo.uploadedDataUrl}
                    alt="Uploaded logo preview"
                    className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate((prev) => ({
                        ...prev,
                        logo: { ...prev.logo, uploadedDataUrl: '', mode: 'none' },
                      }))
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {logo.mode !== 'none' && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Logo Scale</span>
                    <span className="font-mono">{Math.round(logo.imageSize * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.15}
                    max={0.45}
                    step={0.01}
                    value={logo.imageSize}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        logo: { ...prev.logo, imageSize: Number(e.target.value) },
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Logo Padding</span>
                    <span className="font-mono">{logo.imageMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={logo.imageMargin}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        logo: { ...prev.logo, imageMargin: Number(e.target.value) },
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {(logo.mode === 'icon' || logo.mode === 'monogram') && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Badge Shape
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'circle', label: 'Circle' },
                        { id: 'rounded', label: 'Rounded' },
                        ...(logo.mode === 'icon' ? [{ id: 'none', label: 'Icon Only' }] : []),
                      ] as { id: LogoBadgeShape; label: string }[]
                    ).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() =>
                          onUpdate((prev) => ({
                            ...prev,
                            logo: { ...prev.logo, badgeShape: b.id },
                          }))
                        }
                        className={`py-1.5 rounded-lg border text-xs font-semibold transition ${
                          logo.badgeShape === b.id
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={logo.hideBackgroundDots}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      logo: { ...prev.logo, hideBackgroundDots: e.target.checked },
                    }))
                  }
                  className="rounded border-slate-300 text-indigo-600"
                />
                Clear QR modules behind logo (recommended)
              </label>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FRAME & PRINTABLE CARD */}
      {activeTab === 'frame' && (
        <div className="space-y-4">
          {/* Stage Mode Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdate((prev) => ({ ...prev, stageMode: 'qr' }))}
              className={`p-2.5 rounded-xl border text-left transition ${
                stageMode === 'qr'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <Frame className="w-3.5 h-3.5" /> QR + Scan Frame
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">
                Clean sticker, CTA badge, or raw code
              </div>
            </button>
            <button
              type="button"
              onClick={() => onUpdate((prev) => ({ ...prev, stageMode: 'card' }))}
              className={`p-2.5 rounded-xl border text-left transition ${
                stageMode === 'card'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <div className="text-xs font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Printable Card / Sign
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">
                Full poster, table tent, or invitation
              </div>
            </button>
          </div>

          {stageMode === 'qr' ? (
            <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Scan Frame Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {FRAME_STYLES.map((fs) => (
                    <button
                      key={fs.id}
                      type="button"
                      onClick={() =>
                        onUpdate((prev) => ({ ...prev, frame: { ...prev.frame, style: fs.id } }))
                      }
                      className={`py-2 px-2 rounded-xl border text-xs font-semibold transition ${
                        frame.style === fs.id
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>

              {frame.style !== 'none' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Call-to-Action Label
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      value={frame.ctaText}
                      onChange={(e) =>
                        onUpdate((prev) => ({
                          ...prev,
                          frame: { ...prev.frame, ctaText: e.target.value },
                        }))
                      }
                      placeholder="SCAN ME"
                      className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <ColorField
                      label="Frame"
                      value={frame.frameColor}
                      onChange={(frameColor) =>
                        onUpdate((prev) => ({ ...prev, frame: { ...prev.frame, frameColor } }))
                      }
                    />
                    <ColorField
                      label="Badge / Accent"
                      value={frame.accentColor}
                      onChange={(accentColor) =>
                        onUpdate((prev) => ({ ...prev, frame: { ...prev.frame, accentColor } }))
                      }
                    />
                    <ColorField
                      label="Label Text"
                      value={frame.textColor}
                      onChange={(textColor) =>
                        onUpdate((prev) => ({ ...prev, frame: { ...prev.frame, textColor } }))
                      }
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                      <span>Frame Radius</span>
                      <span className="font-mono">{frame.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={36}
                      value={frame.borderRadius}
                      onChange={(e) =>
                        onUpdate((prev) => ({
                          ...prev,
                          frame: { ...prev.frame, borderRadius: Number(e.target.value) },
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              {/* Card Templates */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Card Layout Template
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(CARD_TEMPLATE_PRESETS) as CardTemplate[]).map((tplKey) => {
                    const tpl = CARD_TEMPLATE_PRESETS[tplKey];
                    return (
                      <button
                        key={tplKey}
                        type="button"
                        onClick={() =>
                          onUpdate((prev) => ({
                            ...prev,
                            card: {
                              ...prev.card,
                              template: tplKey,
                              cardBg: tpl.cardBg,
                              cardText: tpl.cardText,
                              accentColor: tpl.accentColor,
                              fontStyle: tpl.fontStyle,
                              showInnerBorder: tpl.showInnerBorder,
                            },
                          }))
                        }
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-2 ${
                          card.template === tplKey
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: tpl.cardBg }}
                        />
                        <span>{tpl.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aspect & Font */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Card Proportions
                  </label>
                  <select
                    value={card.aspect}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, aspect: e.target.value as CardAspect },
                      }))
                    }
                    className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="5/7">5:7 Table Sign</option>
                    <option value="4/5">4:5 Social Flyer</option>
                    <option value="1/1">1:1 Square Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Typography
                  </label>
                  <select
                    value={card.fontStyle}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, fontStyle: e.target.value as CardFontStyle },
                      }))
                    }
                    className="w-full py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="modern">Modern Sans</option>
                    <option value="luxury-serif">Luxury Script + Serif</option>
                    <option value="editorial">Editorial Playfair</option>
                    <option value="cinzel">Classic Engraved</option>
                  </select>
                </div>
              </div>

              {/* Card Text Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Eyebrow / Tag</label>
                  <input
                    type="text"
                    value={card.eyebrow}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, eyebrow: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">QR Pill Label</label>
                  <input
                    type="text"
                    value={card.scanBadgeText}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, scanBadgeText: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={card.heading}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      card: { ...prev.card, heading: e.target.value },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Subtitle / Prompt</label>
                <input
                  type="text"
                  value={card.subtitle}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      card: { ...prev.card, subtitle: e.target.value },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Footer Note</label>
                <input
                  type="text"
                  value={card.footer}
                  onChange={(e) =>
                    onUpdate((prev) => ({
                      ...prev,
                      card: { ...prev.card, footer: e.target.value },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>

              {/* Card Colors */}
              <div className="grid grid-cols-3 gap-2">
                <ColorField
                  label="Card BG"
                  value={card.cardBg}
                  onChange={(cardBg) =>
                    onUpdate((prev) => ({ ...prev, card: { ...prev.card, cardBg } }))
                  }
                />
                <ColorField
                  label="Text"
                  value={card.cardText}
                  onChange={(cardText) =>
                    onUpdate((prev) => ({ ...prev, card: { ...prev.card, cardText } }))
                  }
                />
                <ColorField
                  label="Accent"
                  value={card.accentColor}
                  onChange={(accentColor) =>
                    onUpdate((prev) => ({ ...prev, card: { ...prev.card, accentColor } }))
                  }
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.showInnerBorder}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, showInnerBorder: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  Decorative border
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.showScanBadge}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, showScanBadge: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  Scan pill badge
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.showEncodedHint}
                    onChange={(e) =>
                      onUpdate((prev) => ({
                        ...prev,
                        card: { ...prev.card, showEncodedHint: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  Show link summary
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange }) => {
  const [draft, setDraft] = useState(value.toUpperCase());

  React.useEffect(() => {
    setDraft(value.toUpperCase());
  }, [value]);

  const safePickerHex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2">
      <span className="block text-[10px] font-semibold text-slate-500 mb-1 truncate">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={safePickerHex}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-slate-200 cursor-pointer p-0 shrink-0"
        />
        <input
          type="text"
          value={draft}
          maxLength={7}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            if (/^#[0-9A-F]{0,6}$/.test(v)) {
              setDraft(v);
              if (/^#[0-9A-F]{6}$/.test(v)) {
                onChange(v);
              }
            }
          }}
          onBlur={() => setDraft(value.toUpperCase())}
          className="w-full min-w-0 text-[11px] font-mono uppercase text-slate-700 focus:outline-none"
        />
      </div>
    </div>
  );
};
