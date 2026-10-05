import React from 'react';
import { Globe, RotateCcw, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { translations } from '../utils/i18n';

export default function Navbar({ language, setLanguage, onReset }) {
  const t = translations[language] || translations.en;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
      {/* Top Tiranga Accent Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                {t.appTitle}
                <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full border border-orange-200">
                  MVP
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t.tagline} • <span className="font-medium text-slate-700">{t.teamInfo}</span>
            </p>
          </div>
        </div>

        {/* Controls: Language Selector + Reset */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-1 mr-1" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer pr-1 py-0.5"
            >
              <option value="en">English (EN)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
              <option value="hi">हिंदी (HI)</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title={t.resetChat}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.resetChat}</span>
          </button>
        </div>
      </div>

      {/* Official Guidance Layer Banner */}
      <div className="bg-amber-50 border-t border-amber-200/60 px-4 py-1.5 text-[11px] sm:text-xs text-amber-900 flex items-center justify-center gap-1.5 text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>{t.disclaimer}</span>
      </div>
    </header>
  );
}
