import React from 'react';
import { AlertTriangle, Phone, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { translations } from '../utils/i18n';

export default function EscalationModal({ isOpen, onClose, helplines = [], language = 'en', reason }) {
  if (!isOpen) return null;
  const t = translations[language] || translations.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {t.helplinesTitle}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {reason && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
              <strong>Official Guidance Escalation:</strong> {reason}
            </div>
          )}

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            JanSahay AI upholds strict Responsible AI principles. If criteria cannot be verified with high certainty, we connect citizens directly to verified government desks and toll-free helplines.
          </p>

          <div className="space-y-3">
            {helplines.map((line, idx) => {
              const name = line.name[language] || line.name.en;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 hover:bg-slate-100/70 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block mb-0.5">
                        {line.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {line.operating_hours} • {line.jurisdiction}
                      </p>
                    </div>

                    <a
                      href={`tel:${line.toll_free.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{line.toll_free}</span>
                    </a>
                  </div>

                  {line.portal_url && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Official Portal:</span>
                      <a
                        href={line.portal_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1 hover:underline"
                      >
                        Visit Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
