# JanSahay AI (ಜನಸಹಾಯ್ AI / जनसहाय AI)
### AI-Powered Multilingual Public-Service Navigator
**Track 1: Agentic AI for Billions · Build for Billions Hackathon**  
**Team CIVIX — JSS Science and Technology University (JSSSTU), Mysuru, Karnataka**  
*Sumukh P · Himanth T V · Gowtham M Gowda · Mohammad Umar*

---

## 1. Executive Summary

Over 85% of Indian households own smartphones, yet the **Aware ≠ Applied** gap persists: hundreds of official welfare and scholarship schemes exist on portals like **myScheme**, **India.gov.in**, and state portals (e.g. Karnataka SSP, Seva Sindhu), but citizens drop off due to:
1. **Discovery Gap:** "Which service applies to me?"
2. **Complexity Gap:** "Do I qualify?" (Bureaucratic legal jargon)
3. **Access Gap:** "How do I apply?" (Language & literacy barriers, missing document checklists)

**JanSahay AI** is a conversational, multilingual agentic navigator that bridges this gap. It does **not** replace government portals. Instead, it provides a transparent guidance layer:  
$$\text{Discovery} \longrightarrow \text{Plain-Language Explanation} \longrightarrow \text{Verified Official Handoff}$$

---

## 2. Autonomous Agent Architecture (ASK $\rightarrow$ ACT)

```
 CITIZEN INTERFACE (Web App - React + Tailwind)
 ├── Text & Voice Input (Native Web Speech STT/TTS)
 ├── Multilingual Selector (English · ಕನ್ನಡ · हिंदी)
 └── Grounded Scheme Cards & Interactive Document Checklists
               │
               ▼
 JANSAHAY AGENTIC ENGINE (Express API + AI Orchestrator)
 ├── [ASK]        Ingest natural language (text or voice transcript)
 ├── [UNDERSTAND] Extract State, Income, Category, Occupation, Education
 │                └─ Targeted follow-up when critical fields are missing
 ├── [MATCH]      RAG retrieval over curated scheme repository
 ├── [VERIFY]     Ground against official source text + freshness metadata
 ├── [GUIDE]      Translate plain-language "Why you match" & documents
 └── [ACT]        Verified direct portal handoff OR human helpline escalation
               │
               ▼
 TRUST & DPI LAYER
 ├── Curated Schemes DB with Last Audited Dates & Source PDFs
 ├── Official Portals: SSP Karnataka, NSP, PM-KISAN, PM-JAY, Seva Sindhu
 └── National Helplines: CPGRAMS (1800-11-0031), Seva Sindhu (1902), Kisan (1800-180-1551)
```

---

## 3. Key MVP Features & Responsible AI Guardrails

| Requirement | Implementation in JanSahay AI |
|---|---|
| **Voice & Multilingual** | Full native voice speech-to-text (STT) and voice readout (TTS) supporting English, Kannada, and Hindi. |
| **Strict Grounding** | **100% grounded** recommendations. Zero hallucinated eligibility rules; every scheme cites official guidelines with `last_verified_at` timestamps. |
| **Document Checklists** | Interactive document checklists allowing citizens to tick off required papers (Aadhaar, RD Numbers, Income proofs) before applying. |
| **Human Escalation (FR-13)** | Low-confidence matches (< 50% or ambiguous scenarios) automatically activate the Official Helpline & Grievance Directory modal. |
| **Privacy by Design** | Session-only data retention. Citizen context is kept in-memory and discarded upon session reset. |

---

## 4. Curated Scheme Database (MVP Scope)

1. **State Scholarship Portal (SSP) - Post-Matric (Karnataka)**
2. **National Scholarship Portal (NSP) - Post-Matric Minority Scheme (Central)**
3. **Yuva Nidhi Scheme (Karnataka)** — Unemployed graduate/diploma allowance
4. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)** — ₹6,000/year farmer income support
5. **Ayushman Bharat PM-JAY** — ₹5 Lakh cashless health cover
6. **Gruha Lakshmi Scheme (Karnataka)** — ₹2,000/month women head financial assistance
7. **PM Vishwakarma Scheme** — Artisan toolkit grant & low-interest enterprise credit
8. **Pradhan Mantri Awas Yojana - Gramin (PMAY-G)** — Rural housing assistance

---

## 5. Quickstart & Installation

### Prerequisites
- Node.js (v18+ or v24 LTS)
- npm (v10+ or v11+)

### 1. Clone & Install Dependencies
```bash
# In the project root:
npm install

# Install server dependencies:
cd server
npm install

# Install client dependencies:
cd ../client
npm install
```

### 2. Run JanSahay AI (One Command)
From the root directory:
```bash
npm run dev
```

* **Frontend:** `http://localhost:3000`
* **Backend API:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/api/health`

---

## 6. Citizen Journey Test Scenarios

Try these real-world citizen queries in the interface:

1. **Engineering Student (Karnataka - Kannada or English):**
   * *English:* `"I am an engineering student in Mysore from OBC category with income 1.8 Lakh, what scholarships can I get?"`
   * *Kannada:* `"ನಾನು ಕರ್ನಾಟಕದಲ್ಲಿ ಓದುತ್ತಿರುವ ಒಬಿಸಿ ಇಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿ, ನನಗೆ ಯಾವ ವಿದ್ಯಾರ್ಥಿವೇತನ ಸಿಗುತ್ತದೆ?"`
   * *Result:* Matched to SSP Post-Matric Scholarship with 100% match score, fee concession details, RD number checklist, and official SSP portal link.

2. **Small Farmer Seeking Support:**
   * *Query:* `"I am a small farmer with 2 acres of land, how can I get financial help from government?"`
   * *Result:* Matched to PM-KISAN, explaining ₹6,000 DBT benefit, Pahani/RTC land document checklist, and eKYC portal link.

3. **Unemployed Graduate:**
   * *Query:* `"I completed my degree in Karnataka in 2024 and I am still looking for a job, what schemes apply?"`
   * *Result:* Matched to Yuva Nidhi Scheme with ₹3,000/month allowance checklist and Seva Sindhu link.

4. **Ambiguous Query (Missing Attribute Handling):**
   * *Query:* `"Hello, I need help finding government schemes"`
   * *Result:* Agent detects missing occupation and presents targeted interactive chips (Student, Farmer, Job Seeker, Family Welfare).

---

## 7. Team CIVIX — JSSSTU
* **Sumukh P** — AI/ML & Agent Engineering (Lead)
* **Himanth T V** — Frontend & UX Engineering
* **Gowtham M Gowda** — Product & Agent Strategy
* **Mohammad Umar** — Backend Engineering
