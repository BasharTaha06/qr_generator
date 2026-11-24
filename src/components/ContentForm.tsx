import React, { useState } from 'react';
import {
  Contact,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { QUICK_STARTERS } from '../data/presets';
import { ContentState, ContentType, StudioState } from '../types';
import { buildQrPayload, normalizeUrl } from '../utils/qrPayload';

interface ContentFormProps {
  content: ContentState;
  onChange: (next: ContentState) => void;
  onApplyQuickStarter: (fn: (prev: StudioState) => StudioState) => void;
}

const CONTENT_TABS: { id: ContentType; label: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'Link / URL', icon: <Link2 className="w-3.5 h-3.5" /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'vcard', label: 'vCard', icon: <Contact className="w-3.5 h-3.5" /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { id: 'text', label: 'Text', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'phone', label: 'Phone', icon: <Phone className="w-3.5 h-3.5" /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'location', label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
];

export const ContentForm: React.FC<ContentFormProps> = ({
  content,
  onChange,
  onApplyQuickStarter,
}) => {
  const [showWifiPass, setShowWifiPass] = useState(false);

  const setType = (type: ContentType) => onChange({ ...content, type });

  const encodedPreview = buildQrPayload(content);

  const testUrl = () => {
    const target =
      content.type === 'url'
        ? normalizeUrl(content.url.link)
        : content.type === 'whatsapp'
        ? encodedPreview
        : '';
    if (target) window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Quick Starter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mr-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Quick Starters:
        </span>
        {QUICK_STARTERS.map((starter) => (
          <button
            key={starter.id}
            type="button"
            onClick={() => onApplyQuickStarter(starter.apply)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition"
          >
            {starter.label}
          </button>
        ))}
      </div>

      {/* Content Type Switcher */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
        {CONTENT_TABS.map((tab) => {
          const active = content.type === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setType(tab.id)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold border transition ${
                active
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Input Form */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-3">
        {content.type === 'url' && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Destination Website or Link
                </label>
                <button
                  type="button"
                  onClick={testUrl}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Open Link <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <input
                type="url"
                value={content.url.link}
                onChange={(e) =>
                  onChange({
                    ...content,
                    url: { ...content.url, link: e.target.value },
                  })
                }
                placeholder="https://yourwebsite.com/page"
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {['https://', 'https://linktr.ee/', 'https://instagram.com/'].map((prefix) => (
                    <button
                      key={prefix}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...content,
                          url: { ...content.url, link: prefix },
                        })
                      }
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition"
                    >
                      {prefix}
                    </button>
                  ))}
                </div>
                <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.url.useUtm}
                    onChange={(e) =>
                      onChange({
                        ...content,
                        url: { ...content.url, useUtm: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Add UTM tracking
                </label>
              </div>
            </div>

            {content.url.useUtm && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80">
                <input
                  type="text"
                  placeholder="utm_source (e.g. flyer)"
                  value={content.url.utmSource}
                  onChange={(e) =>
                    onChange({ ...content, url: { ...content.url, utmSource: e.target.value } })
                  }
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="utm_medium (e.g. qr)"
                  value={content.url.utmMedium}
                  onChange={(e) =>
                    onChange({ ...content, url: { ...content.url, utmMedium: e.target.value } })
                  }
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="utm_campaign (e.g. launch)"
                  value={content.url.utmCampaign}
                  onChange={(e) =>
                    onChange({ ...content, url: { ...content.url, utmCampaign: e.target.value } })
                  }
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </>
        )}

        {content.type === 'text' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Plain Text / Message</label>
              <span className="text-[11px] font-mono text-slate-400">
                {content.text.length} chars
              </span>
            </div>
            <textarea
              rows={3}
              value={content.text}
              onChange={(e) => onChange({ ...content, text: e.target.value })}
              placeholder="Enter any text, coupon code, or instructions..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>
        )}

        {content.type === 'wifi' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={content.wifi.ssid}
                  onChange={(e) =>
                    onChange({ ...content, wifi: { ...content.wifi, ssid: e.target.value } })
                  }
                  placeholder="My_WiFi_Network"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security / Encryption
                </label>
                <select
                  value={content.wifi.encryption}
                  onChange={(e) =>
                    onChange({
                      ...content,
                      wifi: {
                        ...content.wifi,
                        encryption: e.target.value as ContentState['wifi']['encryption'],
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open (No Password)</option>
                </select>
              </div>
            </div>
            {content.wifi.encryption !== 'nopass' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showWifiPass ? 'text' : 'password'}
                    value={content.wifi.password}
                    onChange={(e) =>
                      onChange({ ...content, wifi: { ...content.wifi, password: e.target.value } })
                    }
                    placeholder="Wi-Fi password"
                    className="w-full px-3 py-2 pr-10 text-sm font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPass((s) => !s)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                    aria-label="Toggle password visibility"
                  >
                    {showWifiPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={content.wifi.hidden}
                onChange={(e) =>
                  onChange({ ...content, wifi: { ...content.wifi, hidden: e.target.checked } })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Hidden SSID network
            </label>
          </div>
        )}

        {content.type === 'vcard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="First Name"
              value={content.vcard.firstName}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, firstName: e.target.value } })
              }
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={content.vcard.lastName}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, lastName: e.target.value } })
              }
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Company / Organization"
              value={content.vcard.organization}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, organization: e.target.value } })
              }
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Job Title"
              value={content.vcard.title}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, title: e.target.value } })
              }
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={content.vcard.phone}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, phone: e.target.value } })
              }
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={content.vcard.email}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, email: e.target.value } })
              }
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="url"
              placeholder="Website URL"
              value={content.vcard.website}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, website: e.target.value } })
              }
              className="sm:col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={content.vcard.address}
              onChange={(e) =>
                onChange({ ...content, vcard: { ...content.vcard, address: e.target.value } })
              }
              className="sm:col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
          </div>
        )}

        {content.type === 'whatsapp' && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Number (with country code)
              </label>
              <input
                type="tel"
                value={content.whatsapp.phone}
                onChange={(e) =>
                  onChange({ ...content, whatsapp: { ...content.whatsapp, phone: e.target.value } })
                }
                placeholder="+15551234567"
                className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pre-filled Message (optional)
              </label>
              <textarea
                rows={2}
                value={content.whatsapp.message}
                onChange={(e) =>
                  onChange({
                    ...content,
                    whatsapp: { ...content.whatsapp, message: e.target.value },
                  })
                }
                placeholder="Hi! I scanned your QR code..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        )}

        {content.type === 'email' && (
          <div className="space-y-2.5">
            <input
              type="email"
              placeholder="Recipient Email"
              value={content.email.to}
              onChange={(e) =>
                onChange({ ...content, email: { ...content.email, to: e.target.value } })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Subject Line"
              value={content.email.subject}
              onChange={(e) =>
                onChange({ ...content, email: { ...content.email, subject: e.target.value } })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
            <textarea
              rows={2}
              placeholder="Message Body"
              value={content.email.body}
              onChange={(e) =>
                onChange({ ...content, email: { ...content.email, body: e.target.value } })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
          </div>
        )}

        {content.type === 'phone' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number to Dial
            </label>
            <input
              type="tel"
              value={content.phone}
              onChange={(e) => onChange({ ...content, phone: e.target.value })}
              placeholder="+1 555 234 5678"
              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-xl"
            />
          </div>
        )}

        {content.type === 'sms' && (
          <div className="space-y-2.5">
            <input
              type="tel"
              placeholder="Recipient Phone Number"
              value={content.sms.phone}
              onChange={(e) =>
                onChange({ ...content, sms: { ...content.sms, phone: e.target.value } })
              }
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl"
            />
            <textarea
              rows={2}
              placeholder="Pre-filled SMS Text"
              value={content.sms.message}
              onChange={(e) =>
                onChange({ ...content, sms: { ...content.sms, message: e.target.value } })
              }
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
            />
          </div>
        )}

        {content.type === 'location' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
              <input
                type="text"
                value={content.location.latitude}
                onChange={(e) =>
                  onChange({
                    ...content,
                    location: { ...content.location, latitude: e.target.value },
                  })
                }
                placeholder="37.7749"
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
              <input
                type="text"
                value={content.location.longitude}
                onChange={(e) =>
                  onChange({
                    ...content,
                    location: { ...content.location, longitude: e.target.value },
                  })
                }
                placeholder="-122.4194"
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Encoded Data Preview Strip */}
        <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2 text-[11px] text-slate-500">
          <span className="truncate font-mono" title={encodedPreview}>
            Encoded: <strong className="text-slate-700">{encodedPreview}</strong>
          </span>
          <span className="shrink-0 px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">
            {new Blob([encodedPreview]).size} B
          </span>
        </div>
      </div>
    </div>
  );
};
