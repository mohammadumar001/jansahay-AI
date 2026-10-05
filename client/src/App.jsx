import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import EscalationModal from './components/EscalationModal';
import { translations } from './utils/i18n';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [helplines, setHelplines] = useState([]);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState(null);

  const t = translations[language] || translations.en;

  // Initialize or reset welcome message when language changes or on start
  const getWelcomeMessage = (lang) => {
    if (lang === 'kn') {
      return {
        id: 'welcome',
        sender: 'agent',
        step: 'ASK',
        text: 'ನಮಸ್ಕಾರ! ನಾನು ಜನಸಹಾಯ್ AI — ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಸೇವಾ ಮಾರ್ಗದರ್ಶಿ. ವಿದ್ಯಾರ್ಥಿವೇತನ, ರೈತ ಯೋಜನೆಗಳು ಅಥವಾ ಸರ್ಕಾರಿ ಕಲ್ಯಾಣ ಕಾರ್ಯಕ್ರಮಗಳ ಬಗ್ಗೆ ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ. ನಾನು ನಿಮಗೆ ಅರ್ಹತೆ, ಅಗತ್ಯ ದಾಖಲೆಗಳು ಮತ್ತು ಅಧಿಕೃತ ಅರ್ಜಿ ಲಿಂಕ್ ನೀಡುತ್ತೇನೆ.',
        schemes: []
      };
    } else if (lang === 'hi') {
      return {
        id: 'welcome',
        sender: 'agent',
        step: 'ASK',
        text: 'नमस्ते! मैं जनसहाय एआई हूँ — आपका डिजिटल सार्वजनिक-सेवा मार्गदर्शक। छात्रवृत्ति, किसान सहायता, युवा रोजगार या परिवार कल्याण योजनाओं के बारे में पूछें। मैं आपको सही योजना, आवश्यक दस्तावेज़ और आधिकारिक आवेदन लिंक बताऊंगा।',
        schemes: []
      };
    } else {
      return {
        id: 'welcome',
        sender: 'agent',
        step: 'ASK',
        text: 'Namaste! I am JanSahay AI — your public-service navigator. Ask me anything about scholarships, farmer support, pensions, or welfare benefits. I will find matching schemes, explain eligibility and documents in plain language, and guide you directly to the verified official portal.',
        schemes: []
      };
    }
  };

  useEffect(() => {
    setMessages([getWelcomeMessage(language)]);
  }, [language]);

  // Fetch official helplines on mount
  useEffect(() => {
    fetch('/api/helplines')
      .then(res => res.json())
      .then(data => {
        if (data.helplines) setHelplines(data.helplines);
      })
      .catch(err => console.error('Failed to load helplines:', err));
  }, []);

  const handleSendMessage = async (text, overrideProfile) => {
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const activeProfile = overrideProfile || profile;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile: activeProfile,
          language
        })
      });

      const data = await response.json();

      if (data.profile) {
        setProfile(data.profile);
      }

      if (data.escalation && data.escalation.shouldEscalate) {
        setEscalationReason(data.escalation.reason);
      }

      const agentMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        step: data.step,
        text: data.message,
        followUp: data.followUp,
        schemes: data.schemes || [],
        escalation: data.escalation,
        groundingSummary: data.groundingSummary
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        step: 'ERROR',
        text: 'Sorry, I encountered a communication error with the verification server. Please verify your connection or try again.',
        schemes: []
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (optionValue, fieldName) => {
    const updated = { ...profile, [fieldName]: optionValue };
    setProfile(updated);

    // Send context selection as a message to continue the loop with updated profile
    const followUpLabel = `${optionValue}`;
    handleSendMessage(`I selected ${followUpLabel} for ${fieldName}`, updated);
  };

  const handleReset = () => {
    setProfile({});
    setMessages([getWelcomeMessage(language)]);
    setEscalationReason(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onReset={handleReset}
      />

      <main className="flex-1 flex flex-col pt-2">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          onOptionSelect={handleOptionSelect}
          isLoading={isLoading}
          language={language}
          onOpenHelplines={() => setIsHelplineOpen(true)}
          activeProfile={profile}
        />
      </main>

      <EscalationModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
        helplines={helplines}
        language={language}
        reason={escalationReason}
      />
    </div>
  );
}
