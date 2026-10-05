/**
 * JanSahay AI — Profile & Intent Extractor
 * Extracts citizen profile attributes (State, Category, Income, Occupation, Education, Gender)
 * and determines if critical fields are missing to trigger follow-up questions.
 */

export function extractProfile(userMessage, currentProfile = {}, language = 'en') {
  const text = (userMessage || '').toLowerCase();
  const profile = { ...currentProfile };

  // 1. State extraction
  if (text.includes('karnataka') || text.includes('ಕರ್ನಾಟಕ') || text.includes('mysuru') || text.includes('mysore') || text.includes('bangalore') || text.includes('bengaluru')) {
    profile.state = 'Karnataka';
  } else if (text.includes('maharashtra') || text.includes('delhi') || text.includes('tamil nadu') || text.includes('kerala') || text.includes('uttar pradesh') || /\bup\b/i.test(text) || text.includes('goa') || text.includes('bihar') || text.includes('rajasthan')) {
    const states = ['Maharashtra', 'Delhi', 'Tamil Nadu', 'Kerala', 'Uttar Pradesh', 'Goa', 'Bihar', 'Rajasthan'];
    for (const s of states) {
      if (text.includes(s.toLowerCase())) profile.state = s;
    }
    if (/\bup\b/i.test(text)) profile.state = 'Uttar Pradesh';
  }

  // 2. Occupation / Status
  if (text.includes('student') || text.includes('ವಿದ್ಯಾರ್ಥಿ') || text.includes('छात्र') || text.includes('college') || text.includes('school') || text.includes('studying') || text.includes('scholarship') || text.includes('ವಿದ್ಯಾರ್ಥಿವೇತನ') || text.includes('छात्रवृत्ति')) {
    profile.occupation = 'Student';
  } else if (text.includes('farmer') || text.includes('ರೈತ') || text.includes('ಕೃಷಿ') || text.includes('किसान') || text.includes('kisan') || text.includes('agriculture') || text.includes('cultivat')) {
    profile.occupation = 'Farmer';
    profile.land_ownership = true;
  } else if (text.includes('unemployed') || text.includes('job seeker') || text.includes('ನಿರುದ್ಯೋಗಿ') || text.includes('बेरोजगार') || text.includes('pass out') || text.includes('graduated')) {
    profile.occupation = 'Unemployed';
  } else if (text.includes('artisan') || text.includes('carpenter') || text.includes('blacksmith') || text.includes('tailor') || text.includes('potter') || text.includes('ಬಡಗಿ') || text.includes('ಕುಂಬಾರ') || text.includes('ದರ್ಜಿ') || text.includes('बढ़ई') || text.includes('कारीगर')) {
    profile.occupation = 'Artisan';
  } else if (text.includes('corporate') || text.includes('software') || text.includes('engineer') || text.includes('developer') || text.includes('employed') || text.includes('salaried') || text.includes('private job') || text.includes('business') || text.includes('company') || text.includes('it employee') || text.includes('ಉದ್ಯೋಗಿ') || text.includes('ನೌಕರ') || text.includes('नौकरी')) {
    profile.occupation = 'Employed';
  } else if (text.includes('housewife') || text.includes('homemaker') || text.includes('woman') || text.includes('ಮಹಿಳೆ') || text.includes('ಗೃಹಿಣಿ') || text.includes('महिला')) {
    profile.gender = 'Female';
  }

  // 3. Category / Caste (using word-boundary regex to prevent false positives from "scholarships", "startup", "schemes")
  if (/\b(obc|backward\s+class|cat-1|cat\s*1|2a|2b|3a|3b)\b/i.test(text) || text.includes('ಹಿಂದುಳಿದ') || text.includes('ओबीसी')) {
    profile.category = 'OBC';
  } else if (/\b(sc|scheduled\s+caste)\b/i.test(text) || text.includes('ಪರಿಶಿಷ್ಟ ಜಾತಿ') || text.includes('अनुसूचित जाति')) {
    profile.category = 'SC';
  } else if (/\b(st|scheduled\s+tribe)\b/i.test(text) || text.includes('ಪರಿಶಿಷ್ಟ ಪಂಗಡ') || text.includes('अनुसूचित जनजाति')) {
    profile.category = 'ST';
  } else if (/\b(minority|muslim|christian|sikh|jain|parsi|buddhist)\b/i.test(text) || text.includes('ಅಲ್ಪಸಂಖ್ಯಾತ') || text.includes('अल्पसंख्यक')) {
    profile.category = 'Minority';
  } else if (/\b(general|open\s+category|gm|unreserved)\b/i.test(text) || text.includes('ಸಾಮಾನ್ಯ') || text.includes('सामान्य')) {
    profile.category = 'General';
  }

  if (/\b(bpl|antyodaya|aay|poor)\b/i.test(text) || text.includes('ration card') || text.includes('ಪಡಿತರ ಚೀಟಿ') || text.includes('राशन कार्ड')) {
    profile.ration_card = 'BPL';
  }

  // Land ownership flag normalization
  if (text.includes('land') || text.includes('acres') || text.includes('ಎಕರೆ') || text.includes('एकड़') || text.includes('pahani') || text.includes('rtc') || text.includes('khasra')) {
    profile.land_ownership = true;
  }
  if (profile.land_ownership === 'yes' || profile.land_ownership === 'true') {
    profile.land_ownership = true;
  } else if (profile.land_ownership === 'no' || profile.land_ownership === 'false') {
    profile.land_ownership = false;
  }

  // 4. Annual Income extraction (e.g. 1.5 lakh, 2 lakh, 150000, 250000)
  const lakhMatch = text.match(/(\d+(\.\d+)?)\s*(lakh|lac|ಲಕ್ಷ|लाख)/i);
  if (lakhMatch) {
    profile.annual_income = parseFloat(lakhMatch[1]) * 100000;
  } else {
    const rawNumberMatch = text.match(/\b(\d{5,7})\b/);
    if (rawNumberMatch) {
      profile.annual_income = parseInt(rawNumberMatch[1], 10);
    }
  }

  // 5. Gender extraction
  if (text.includes('female') || text.includes('woman') || text.includes('girl') || text.includes('ಮಹಿಳೆ') || text.includes('ಹೆಣ್ಣು') || text.includes('महिला') || text.includes('लड़की')) {
    profile.gender = 'Female';
  } else if (text.includes('male') || text.includes('boy') || text.includes('ಗಂಡು') || text.includes('पुरुष') || text.includes('लड़का')) {
    profile.gender = profile.gender || 'Male';
  }

  // 6. Education level (word boundaries for 'be' to avoid matching English verb 'be')
  if (text.includes('engineering') || text.includes('btech') || /\bb\.?e\.?\b/i.test(text) || text.includes('degree') || text.includes('graduate') || text.includes('ಪದವಿ') || text.includes('ಸ್ನಾತಕ')) {
    profile.education_level = 'Degree';
  } else if (text.includes('diploma') || text.includes('ಡಿಪ್ಲೊಮಾ') || text.includes('डिप्लोमा')) {
    profile.education_level = 'Diploma';
  } else if (text.includes('puc') || text.includes('12th') || text.includes('11th') || text.includes('ಪಿಯುಸಿ') || text.includes('12वीं')) {
    profile.education_level = 'PUC';
  }

  return profile;
}

/**
 * Checks for missing required profile attributes to generate targeted follow-up questions
 */
export function detectMissingFields(profile, language = 'en') {
  const missing = [];

  // Need occupation or intent
  if (!profile.occupation && !profile.intent) {
    missing.push({
      field: 'occupation',
      question: {
        en: 'Are you currently a Student, Farmer, Job Seeker / Graduate, or looking for Family Welfare schemes?',
        kn: 'ನೀವು ಪ್ರಸ್ತುತ ವಿದ್ಯಾರ್ಥಿಯೋ, ರೈತರೋ, ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಯೋ (ಪದವೀಧರರು) ಅಥವಾ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕುತ್ತಿದ್ದೀರಾ?',
        hi: 'क्या आप वर्तमान में छात्र हैं, किसान हैं, नौकरी/रोजगार की तलाश में हैं, या परिवार कल्याण योजनाओं की खोज कर रहे हैं?'
      },
      options: [
        { label: 'Student / Scholarship', label_kn: 'ವಿದ್ಯಾರ್ಥಿ / ವಿದ್ಯಾರ್ಥಿವೇತನ', label_hi: 'छात्र / छात्रवृत्ति', value: 'Student' },
        { label: 'Farmer / Agriculture', label_kn: 'ರೈತ / ಕೃಷಿ ಬೆಂಬಲ', label_hi: 'किसान / कृषि सहायता', value: 'Farmer' },
        { label: 'Unemployed Graduate / Diploma', label_kn: 'ನಿರುದ್ಯೋಗಿ ಪದವೀಧರರು / ಡಿಪ್ಲೊಮಾ', label_hi: 'बेरोजगार स्नातक / डिप्लोमा', value: 'Unemployed' },
        { label: 'Family Welfare / Women', label_kn: 'ಕುಟುಂಬ ಕಲ್ಯಾಣ / ಮಹಿಳಾ ಯೋಜನೆ', label_hi: 'परिवार कल्याण / महिला योजना', value: 'Homemaker' }
      ]
    });
    return missing;
  }

  // If Student, check State & Category
  if (profile.occupation === 'Student') {
    if (!profile.state) {
      missing.push({
        field: 'state',
        question: {
          en: 'Which state is your domicile / where are you studying?',
          kn: 'ನಿಮ್ಮ ಸ್ವಂತ ರಾಜ್ಯ ಯಾವುದು ಅಥವಾ ನೀವು ಎಲ್ಲಿ ವ್ಯಾಸಂಗ ಮಾಡುತ್ತಿದ್ದೀರಿ?',
          hi: 'आपका गृह राज्य कौन सा है या आप कहाँ अध्ययन कर रहे हैं?'
        },
        options: [
          { label: 'Karnataka', label_kn: 'ಕರ್ನಾಟಕ', label_hi: 'कर्नाटक', value: 'Karnataka' },
          { label: 'Other State (All India)', label_kn: 'ಇತರ ರಾಜ್ಯ (ಅಖಿಲ ಭಾರತ)', label_hi: 'अन्य राज्य (अखिल भारतीय)', value: 'Other' }
        ]
      });
    }

    if (!profile.category) {
      missing.push({
        field: 'category',
        question: {
          en: 'What is your social category (to check fee concession & quota)?',
          kn: 'ನಿಮ್ಮ ಸಾಮಾಜಿಕ ವರ್ಗ ಯಾವುದು (ಶುಲ್ಕ ವಿನಾಯಿತಿ ಪರಿಶೀಲಿಸಲು)?',
          hi: 'आपकी सामाजिक श्रेणी क्या है (शुल्क छूट पात्रता जांचने हेतु)?'
        },
        options: [
          { label: 'SC / ST', label_kn: 'ಎಸ್‍ಸಿ / ಎಸ್‍ಟಿ', label_hi: 'एससी / एसटी', value: 'SC' },
          { label: 'OBC / Cat-1 / 2A / 3A / 3B', label_kn: 'ಒಬಿಸಿ / ಹಿಂದುಳಿದ ವರ್ಗ', label_hi: 'ओबीसी / अन्य पिछड़ा वर्ग', value: 'OBC' },
          { label: 'Minority (Muslim, Christian, Jain, Sikh)', label_kn: 'ಅಲ್ಪಸಂಖ್ಯಾತ', label_hi: 'अल्पसंख्यक', value: 'Minority' },
          { label: 'General', label_kn: 'ಸಾಮಾನ್ಯ ವರ್ಗ', label_hi: 'सामान्य वर्ग', value: 'General' }
        ]
      });
    }
  }

  // If Farmer, check land ownership
  if (profile.occupation === 'Farmer' && profile.land_ownership === undefined) {
    missing.push({
      field: 'land_ownership',
      question: {
        en: 'Do you or your family own cultivable land with recorded revenue papers (Pahani / RTC)?',
        kn: 'ನಿಮ್ಮ ಅಥವಾ ನಿಮ್ಮ ಕುಟುಂಬದ ಹೆಸರಿನಲ್ಲಿ ಕೃಷಿ ಜಮೀನು (ಪಹಣಿ / ಆರ್.ಟಿ.ಸಿ) ಇದೆಯೇ?',
        hi: 'क्या आपके या आपके परिवार के नाम पर कृषि योग्य भूमि (खतौनी / जमाबंदी) दर्ज है?'
      },
      options: [
        { label: 'Yes, have land documents', label_kn: 'ಹೌದು, ಜಮೀನಿನ ದಾಖಲೆಗಳಿವೆ', label_hi: 'हाँ, भूमि दस्तावेज उपलब्ध हैं', value: 'yes' },
        { label: 'No / Tenant Farmer', label_kn: 'ಇಲ್ಲ / ಗೇಣಿ ರೈತ', label_hi: 'नहीं / बटाईदार किसान', value: 'no' }
      ]
    });
  }

  return missing;
}
