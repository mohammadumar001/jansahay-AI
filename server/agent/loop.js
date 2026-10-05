/**
 * JanSahay AI — Autonomous Agent Loop
 * Coordinates ASK -> UNDERSTAND -> MATCH -> VERIFY -> GUIDE -> ACT
 */

import { extractProfile, detectMissingFields } from './extractor.js';
import { matchSchemes } from './matcher.js';
import { verifyScheme, evaluateEscalation } from './verifier.js';

export async function runAgentLoop({ userMessage, sessionProfile = {}, language = 'en' }) {
  // 1. ASK & 2. UNDERSTAND: Extract profile attributes
  const updatedProfile = extractProfile(userMessage, sessionProfile, language);
  const missingFields = detectMissingFields(updatedProfile, language);

  // If there are critical missing fields and this is an initial inquiry or ambiguous prompt:
  if (missingFields.length > 0 && !sessionProfile.occupation && !updatedProfile.occupation) {
    const firstMissing = missingFields[0];
    const followUpText = firstMissing.question[language] || firstMissing.question.en;

    return {
      step: 'UNDERSTAND',
      status: 'AWAITING_INPUT',
      message: followUpText,
      profile: updatedProfile,
      followUp: {
        field: firstMissing.field,
        options: firstMissing.options.map(opt => ({
          label: opt[`label_${language}`] || opt.label,
          value: opt.value
        }))
      },
      schemes: [],
      escalation: null
    };
  }

  // 3. MATCH: Retrieve candidate schemes using profile + query
  const candidates = matchSchemes(updatedProfile, userMessage);

  // 4. VERIFY: Ground against official source text and freshness dates
  const verifiedMatches = [];
  for (const candidate of candidates) {
    const verification = verifyScheme(candidate);
    if (verification.isValid && verification.isEligible) {
      verifiedMatches.push(verification);
    }
  }

  // Check Escalation threshold (FR-13)
  const escalation = evaluateEscalation(verifiedMatches, updatedProfile);

  // 5. GUIDE: Generate plain-language explanation & document checklists
  let guidanceMessage = '';
  if (language === 'kn') {
    if (verifiedMatches.length > 0) {
      guidanceMessage = `ನಿಮ್ಮ ವಿವರಗಳ ಪ್ರಕಾರ, ನೀವು ಅರ್ಹತೆ ಹೊಂದಿರುವ ${verifiedMatches.length} ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಇಲ್ಲಿವೆ. ಪ್ರತಿಯೊಂದು ಯೋಜನೆಯ ವಿವರ, ಅಗತ್ಯ ದಾಖಲೆಗಳು ಮತ್ತು ಅಧಿಕೃತ ಅರ್ಜಿ ಲಿಂಕ್ ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ:`;
    } else {
      guidanceMessage = 'ನೀವು ನೀಡಿದ ವಿವರಗಳಿಗೆ ಸರಿಹೊಂದುವ ಅಧಿಕೃತ ಯೋಜನೆಗಳು ಲಭ್ಯವಿಲ್ಲ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ:';
    }
  } else if (language === 'hi') {
    if (verifiedMatches.length > 0) {
      guidanceMessage = `आपके विवरण के आधार पर, यहाँ ${verifiedMatches.length} आधिकारिक सरकारी योजनाएँ हैं जिनके लिए आप पात्र हैं। प्रत्येक योजना के नियम, आवश्यक दस्तावेज़ और आधिकारिक लिंक नीचे दिए गए हैं:`;
    } else {
      guidanceMessage = 'आपके द्वारा दिए गए विवरण के अनुसार कोई सत्यापित योजना नहीं मिली। कृपया आधिकारिक सहायता केंद्र से संपर्क करें:';
    }
  } else {
    // English default
    if (verifiedMatches.length > 0) {
      guidanceMessage = `Based on your profile, we identified ${verifiedMatches.length} officially verified public schemes you qualify for. Below are the plain-language match reasons, required document checklists, and verified application links:`;
    } else {
      guidanceMessage = 'We could not find verified government schemes matching your exact profile with high confidence. You can connect with official public helplines below:';
    }
  }

  // 6. ACT: Return verified scheme handoffs or escalation
  return {
    step: 'ACT',
    status: 'COMPLETE',
    message: guidanceMessage,
    profile: updatedProfile,
    followUp: missingFields.length > 0 ? {
      field: missingFields[0].field,
      question: missingFields[0].question[language] || missingFields[0].question.en,
      options: missingFields[0].options.map(opt => ({
        label: opt[`label_${language}`] || opt.label,
        value: opt.value
      }))
    } : null,
    schemes: verifiedMatches.slice(0, 5), // top 5 most relevant schemes
    escalation,
    groundingSummary: {
      totalCandidatesEvaluated: candidates.length,
      verifiedGroundedMatches: verifiedMatches.length,
      allSourcesGrounded: true,
      lastAudited: new Date().toISOString()
    }
  };
}
