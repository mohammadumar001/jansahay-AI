/**
 * JanSahay AI — Web Speech API Integration
 * Native browser Speech Recognition (STT) and Speech Synthesis (TTS)
 * Supports English (en-IN), Kannada (kn-IN), and Hindi (hi-IN)
 */

let recognitionInstance = null;

const langCodeMap = {
  en: 'en-IN',
  kn: 'kn-IN',
  hi: 'hi-IN'
};

export function isSpeechSupported() {
  return typeof window !== 'undefined' && (
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window
  );
}

export function startListening({ language = 'en', onResult, onError, onEnd }) {
  if (!isSpeechSupported()) {
    onError && onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (recognitionInstance) {
    try {
      recognitionInstance.abort();
    } catch (e) {
      // ignore
    }
  }

  const recognition = new SpeechRecognition();
  recognition.lang = langCodeMap[language] || 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    if (event.results && event.results.length > 0) {
      const transcript = event.results[0][0].transcript;
      onResult && onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    onError && onError(event.error);
  };

  recognition.onend = () => {
    recognitionInstance = null;
    onEnd && onEnd();
  };

  try {
    recognition.start();
    recognitionInstance = recognition;
    return recognition;
  } catch (err) {
    console.error('Failed to start recognition:', err);
    onError && onError(err.message);
    return null;
  }
}

export function stopListening() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      // ignore
    }
    recognitionInstance = null;
  }
}

export function speakText(text, language = 'en', onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  // Strip markdown, URLs, and special symbols for clean natural audio readout
  const cleanText = text
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#*`_~[\]()]/g, '')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langCodeMap[language] || 'en-IN';
  utterance.rate = 0.95; // Slightly slower for clear government guidance
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
