import React, { useEffect, useState } from 'react';
import {
  BookmarkPlus,
  Check,
  QrCode,
  RotateCcw,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { ContentForm } from './components/ContentForm';
import { DesignControls } from './components/DesignControls';
import { PreviewAndExport } from './components/PreviewAndExport';
import { CENTER_ICONS, INITIAL_STUDIO_STATE, QR_THEME_PRESETS } from './data/presets';
import { DotStyle, SavedDesign, StudioState } from './types';
import { getPayloadSummary } from './utils/qrPayload';

const STORAGE_KEY = 'qrforge_saved_designs_v1';

function loadSavedDesigns(): SavedDesign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function App() {
  const [state, setState] = useState<StudioState>(INITIAL_STUDIO_STATE);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(loadSavedDesigns);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDesigns));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedDesigns]);

  const notify = (msg: string) => {
    setToast(msg);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const randomizeStyle = () => {
    const preset = QR_THEME_PRESETS[Math.floor(Math.random() * QR_THEME_PRESETS.length)];
    const dots: DotStyle[] = ['square', 'rounded', 'dots', 'extra-rounded', 'classy', 'classy-rounded'];
    const dotType = dots[Math.floor(Math.random() * dots.length)];
    const icon = CENTER_ICONS[Math.floor(Math.random() * CENTER_ICONS.length)];

    setState((prev) => ({
      ...prev,
      qr: {
        ...prev.qr,
        dotType,
        dotsFill: { ...preset.dotsFill },
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
        mode: 'icon',
        iconId: icon.id,
        iconColor: preset.accentColor,
      },
      frame: {
        ...prev.frame,
        accentColor: preset.accentColor,
      },
    }));
    notify(`Applied "${preset.name}" style!`);
  };

  const resetStudio = () => {
    setState(INITIAL_STUDIO_STATE);
    notify('Studio reset to defaults');
  };

  const saveCurrentDesign = () => {
    const summary = getPayloadSummary(state.content);
    const entry: SavedDesign = {
      id: `${Date.now()}`,
      name: summary,
      createdAt: Date.now(),
      previewLabel: state.content.type.toUpperCase(),
      state,
    };
    setSavedDesigns((prev) => [entry, ...prev].slice(0, 10));
    notify('Design saved locally!');
  };

  const deleteSavedDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((item) => item.id !== id));
    notify('Removed saved design');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-modern text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  QRForge Studio
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Vector &amp; 4K
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Create custom QR codes for any link, Wi-Fi, vCard, or printable sign
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={randomizeStyle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
              Surprise Style
            </button>
            <button
              type="button"
              onClick={saveCurrentDesign}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Save Design
            </button>
            <button
              type="button"
              onClick={resetStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition"
              title="Reset studio"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Saved Designs Strip (when present) */}
        {savedDesigns.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm no-print">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Saved Designs ({savedDesigns.length})
              </span>
              <span className="text-[11px] text-slate-400">Stored in your browser</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {savedDesigns.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setState(item.state);
                      notify(`Loaded "${item.name}"`);
                    }}
                    className="flex items-center gap-2 text-left"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: item.state.qr.dotsFill.color1 }}
                    />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {item.previewLabel}
                    </span>
                    <span className="text-xs font-medium text-slate-700 max-w-[140px] truncate">
                      {item.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSavedDesign(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    aria-label="Delete saved design"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-Column Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Content + Deep Customization */}
          <div className="lg:col-span-6 space-y-5 no-print">
            {/* Step 1: Content */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Step 1
                  </span>
                  <h2 className="font-modern text-base font-bold text-slate-900">
                    Choose Content &amp; Link
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Dynamic instant encoding</span>
              </div>

              <ContentForm
                content={state.content}
                onChange={(content) => setState((prev) => ({ ...prev, content }))}
                onApplyQuickStarter={(applyFn) => setState((prev) => applyFn(prev))}
              />
            </section>

            {/* Step 2: Customize */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Step 2
                  </span>
                  <h2 className="font-modern text-base font-bold text-slate-900">
                    Customize Appearance
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Live vector styling</span>
              </div>

              <DesignControls state={state} onUpdate={setState} />
            </section>
          </div>

          {/* RIGHT: Sticky Live Preview & Multi-Format Export */}
          <div className="lg:col-span-6 lg:sticky lg:top-20">
            <PreviewAndExport
              state={state}
              onUpdateStageMode={(stageMode) => setState((prev) => ({ ...prev, stageMode }))}
              onNotify={notify}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 no-print">
        QRForge Studio — 100% client-side QR generation. Zero tracking, instant vector SVG &amp; 4K 300 DPI exports.
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2 no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
