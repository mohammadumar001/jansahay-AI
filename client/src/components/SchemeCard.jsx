import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { translations } from '../utils/i18n';

export default function SchemeCard({ scheme, language = 'en' }) {
  const t = translations[language] || translations.en;
  const [showDocs, setShowDocs] = useState(true);
  const [checkedDocs, setCheckedDocs] = useState({});

  const title = scheme.name[language] || scheme.name.en;
  const summary = scheme.summary[language] || scheme.summary.en;
  const benefits = scheme.benefits[language] || scheme.benefits.en;

  const toggleDoc = (docId) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const completedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = scheme.required_documents?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-50 via-orange-50/40 to-slate-50 px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {t.verifiedBadge}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {scheme.scope}
          </span>
        </div>

        {/* Match Score Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200">
            {scheme.matchScore}% {t.highConfidence}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Title & Department */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {scheme.department}
          </p>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          {summary}
        </p>

        {/* Key Benefits Callout */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 mb-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Benefit Summary
          </div>
          <p className="text-xs sm:text-sm font-medium text-emerald-800">
            {benefits}
          </p>
        </div>

        {/* Why You Qualify (Plain-language reasons) */}
        {scheme.reasons && scheme.reasons.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              {t.whyYouQualify}:
            </h4>
            <div className="space-y-1.5">
              {scheme.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Documents Interactive Checklist */}
        {totalDocs > 0 && (
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 mb-4">
            <div 
              onClick={() => setShowDocs(!showDocs)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t.requiredDocuments}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {completedCount}/{totalDocs} ready
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-0.5">
                {showDocs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showDocs && (
              <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/70">
                {scheme.required_documents.map((doc) => {
                  const isChecked = !!checkedDocs[doc.id];
                  const docLabel = (language === 'kn' && doc.name_kn) ? doc.name_kn : doc.name;
                  return (
                    <div 
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50 text-emerald-900 font-medium' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'line-through text-slate-500' : ''}>
                        {docLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Freshness, Guidelines, & Audit Meta */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 py-2 border-t border-slate-100 gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.lastVerified}: <strong className="text-slate-700">{scheme.last_verified_at}</strong></span>
          </div>

          {scheme.source_guidelines_url && (
            <a
              href={scheme.source_guidelines_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium hover:underline"
            >
              <FileText className="w-3.5 h-3.5" />
              {t.viewGuidelines}
            </a>
          )}

          {scheme.helpline && (
            <div className="flex items-center gap-1 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Helpline: {scheme.helpline}</span>
            </div>
          )}
        </div>

        {/* Verified Action Link Handoff */}
        <div>
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all text-sm group"
          >
            <span>{t.applyOfficial}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
