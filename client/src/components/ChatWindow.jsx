import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  PhoneCall, 
  Info,
  Loader2
} from 'lucide-react';
import SchemeCard from './SchemeCard';
import { translations } from '../utils/i18n';
import { startListening, stopListening, speakText, stopSpeaking } from '../utils/speech';

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  onOptionSelect, 
  isLoading, 
  language, 
  onOpenHelplines,
  activeProfile 
}) {
  const t = translations[language] || translations.en;
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      startListening({
        language,
        onResult: (transcript) => {
          setInputText(transcript);
          setIsListening(false);
          // Auto send recognized transcript
          onSendMessage(transcript);
        },
        onError: (err) => {
          setIsListening(false);
          console.error(err);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  const handleReadAloud = (msgId, text) => {
    if (speakingMessageId === msgId) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      stopSpeaking();
      setSpeakingMessageId(msgId);
      speakText(text, language, () => {
        setSpeakingMessageId(null);
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto w-full px-2 sm:px-4">
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            {msg.sender === 'user' ? (
              /* User Bubble */
              <div className="flex items-start justify-end gap-2.5">
                <div className="max-w-[85%] sm:max-w-[75%] bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-none shadow-sm text-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 shrink-0 mt-1 border border-orange-200">
                  <User className="w-4 h-4" />
                </div>
              </div>
            ) : (
              /* Agent Response */
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>

                <div className="flex-1 max-w-[95%] sm:max-w-[85%] space-y-3">
                  {/* Step status badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      Agentic Step: {msg.step || 'GUIDE & ACT'}
                    </span>

                    {msg.groundingSummary && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {t.groundedSummary}
                      </span>
                    )}

                    {/* Listen Audio Button */}
                    <button
                      onClick={() => handleReadAloud(msg.id, msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-full transition-colors"
                      title={speakingMessageId === msg.id ? t.stopReading : t.readAloud}
                    >
                      {speakingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3 h-3 text-red-500" />
                          <span>{t.stopReading}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-slate-600" />
                          <span>{t.readAloud}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Main Guidance Text Bubble */}
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-none p-4 shadow-sm text-sm text-slate-800 leading-relaxed">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {/* Follow-up Question Chips (Targeted Missing Fields) */}
                  {msg.followUp && msg.followUp.options && (
                    <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                        <Info className="w-4 h-4 text-orange-600" />
                        <span>{msg.followUp.question || msg.text}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.followUp.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => onOptionSelect(opt.value, msg.followUp.field)}
                            className="text-xs font-medium bg-white hover:bg-orange-600 text-orange-900 hover:text-white border border-orange-300 hover:border-orange-600 px-3 py-1.5 rounded-xl shadow-xs transition-all hover:scale-[1.02]"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Low Confidence Escalation Banner (FR-13) */}
                  {msg.escalation && msg.escalation.shouldEscalate && (
                    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                            {t.confidence}: {t.lowConfidence}
                          </h4>
                          <p className="text-xs text-amber-800 mt-0.5">
                            {msg.escalation.reason || t.escalationAlert}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={onOpenHelplines}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Helplines</span>
                      </button>
                    </div>
                  )}

                  {/* Scheme Cards Stream */}
                  {msg.schemes && msg.schemes.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {msg.schemes.map((scheme) => (
                        <SchemeCard
                          key={scheme.scheme_id}
                          scheme={scheme}
                          language={language}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-slate-500 text-xs py-2 px-1 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
            <span>JanSahay Agent is reasoning, verifying official criteria, and auditing sources...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries (if few messages) */}
      {messages.length <= 2 && (
        <div className="py-2">
          <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            {t.quickQueriesTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {t.quickQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(item.query)}
                className="text-xs bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-950 border border-slate-200 hover:border-orange-300 px-3 py-1.5 rounded-full transition-colors shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="pb-3 pt-2 bg-slate-50">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? t.listening : t.inputPlaceholder}
              disabled={isLoading}
              className={`w-full bg-white border rounded-2xl pl-4 pr-12 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-sm ${
                isListening 
                  ? 'border-orange-500 ring-2 ring-orange-200' 
                  : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100'
              }`}
            />

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
              title={isListening ? t.stopVoice : t.startVoice}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl shadow-sm transition-all shrink-0"
            title={t.send}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
