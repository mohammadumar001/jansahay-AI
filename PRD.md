# Product Requirements Document (PRD)
## JanSahay AI — AI-Powered Multilingual Public-Service Navigator

| | |
|---|---|
| **Team** | Team CIVIX — JSS Science and Technology University (JSSSTU) |
| **Track** | Build for Billions · Track 1: Agentic AI for Billions |
| **Status** | Draft v1.0 — Hackathon MVP |
| **Owners** | Sumukh P (AI/ML & Agent Engineering — Lead) · Himanth T V (Frontend & UX) · Gowtham M Gowda (Product & Agent Strategy) · Mohammad Umar (Backend Engineering) |

---

## 1. Executive Summary

Government of India already runs hundreds of public services and welfare schemes — scholarships, health cover, agricultural support, employment schemes — accessible through portals like **myScheme** and **India.gov.in**. The services exist. What citizens lack is a simple way to find out *which service applies to them*, *whether they qualify*, and *how to complete the process*.

**JanSahay AI** is a conversational, multilingual AI agent that sits on top of this existing public infrastructure. A citizen asks a plain-language question — in text or voice, in their own language — and the agent reasons over their profile, retrieves and verifies matching schemes from an official, trusted database, explains eligibility and required documents in plain language, and hands the citizen off to the verified official application link.

JanSahay AI is explicitly **not** a replacement for any government portal. It is a **navigation and guidance layer**: discovery → explanation → verified handoff.

---

## 2. Problem Statement

### 2.1 The core problem
Public services exist. **Accessing them is the problem.**

### 2.2 The citizen journey today
1. Citizen has a need (scholarship, health cover, farm support)
2. Doesn't know which scheme applies
3. Searches several portals separately
4. Meets complex eligibility rules
5. Faces unclear documents and steps
6. Hits a language or digital-literacy barrier
7. Drops off, or relies on a paid intermediary

### 2.3 The three gaps

| Gap | Citizen question | Root cause |
|---|---|---|
| **Discovery Gap** | "Which service applies to me?" | No single place to search across scheme databases by personal profile |
| **Complexity Gap** | "Do I actually qualify?" | Eligibility rules are written in legal/bureaucratic language, scattered across sources |
| **Access Gap** | "How do I complete this?" | Language barriers, low digital literacy, unclear document/step requirements |

### 2.4 Supporting evidence

| Statistic | Detail | Source |
|---|---|---|
| **62%** | of PM-JAY-eligible households were aware of the scheme (6 states, 2019–20) | PMC10019566, peer-reviewed |
| **53.6%** | of rural persons could use the internet, vs. 74.0% urban | MoSPI CAMS 2022–23, via ThePrint |
| **85.5%** | of households own ≥1 smartphone (2025) — devices exist; guidance is the gap | MoSPI/NSO CMS:T 2025, via PIB |
| **Aware ≠ Applied** | Agents raised scheme awareness but not application rates (RCT, south India) | EDCC 70(2), 2022 |

**Interpretation:** Smartphone penetration shows citizens are digitally reachable. The bottleneck is not connectivity — it's *guided understanding*.

---

## 3. Goals & Objectives

### 3.1 Product goals
- **G1 — Discovery:** Help a citizen find every scheme they are plausibly eligible for, from a single plain-language query.
- **G2 — Comprehension:** Explain eligibility, required documents, and next steps in the citizen's own language, at a plain-language reading level.
- **G3 — Trust:** Every recommendation must be traceable to a verified official source with a freshness/last-verified date.
- **G4 — Access:** Support text and voice input, in English plus at least one Indian language at MVP, expanding over time.
- **G5 — Conversion:** Increase the share of citizens who move from "aware of a scheme" to "started the official application" — closing the Aware ≠ Applied gap.

### 3.2 Non-goals (explicitly out of scope)
- JanSahay AI does **not** replace myScheme, India.gov.in, or any government portal.
- JanSahay AI does **not** submit applications on the citizen's behalf (no automatic application submission).
- JanSahay AI does **not** assume access to government-side APIs; it links out to official channels.
- JanSahay AI does **not** make final eligibility determinations — that authority remains with the issuing department.

### 3.3 Success looks like
A first-time digital user, in their own language, gets from "I don't know what help I can get" to "I have a checklist and a verified official link" in a single guided conversation — with zero ambiguity about whether the information is current and official.

---

## 4. Target Users

| Persona | Primary need |
|---|---|
| **Student** | Scholarships, education schemes |
| **Farmer** | Agriculture, financial support |
| **Job Seeker** | Employment, skill development schemes |
| **Household** | Welfare, certificates, general services |
| **First-Time Digital User** | Guided onboarding to digital government services |

**Also served:** rural/semi-urban citizens, low-income households, regional-language speakers.

**Common trait across personas:** varying digital literacy, likely mobile-first (smartphone, not desktop), often more comfortable speaking than typing, may not read/write fluently in English.

---

## 5. User Stories

| ID | As a... | I want to... | So that... |
|---|---|---|---|
| US-1 | Citizen | ask a question in my own language, by text or voice | I don't need to know English or scheme names in advance |
| US-2 | Citizen | be asked simple follow-up questions when the agent needs more info (state, income, category) | I don't have to guess what details matter |
| US-3 | Citizen | see which schemes I'm likely eligible for, with a plain-language reason | I can quickly judge relevance without reading legal text |
| US-4 | Citizen | see a source link and "last verified" date on every result | I know the information is current and official, not AI-hallucinated |
| US-5 | Citizen | see the document checklist and next steps for a scheme | I can prepare before starting the application |
| US-6 | Citizen | be handed a direct official application link | I complete the process on the government's own verified channel |
| US-7 | Citizen | be escalated to human support when the agent is unsure | I'm not stuck with a wrong or incomplete answer |
| Low-literacy citizen | Citizen | interact fully by voice | I don't need to type or read |

---

## 6. Product Scope

### 6.1 In scope — Hackathon MVP
- Text and voice input in English + one Indian language
- Intent and profile extraction (state, income, category, etc.), with follow-up questioning for missing fields
- RAG-based retrieval over a structured, curated scheme database (initial focus: scholarships and welfare schemes)
- Eligibility verification against official source text, with URL and last-verified date recorded per scheme
- Plain-language explanation of match reason, required documents, and next steps
- Verified official application link handoff, with a source badge
- Low-confidence escalation path to human/official support

### 6.2 Out of scope — MVP
- Automatic application submission
- Direct government API integrations (not assumed to be available)
- Languages beyond English + 1 Indian language (phased rollout — see Roadmap)
- Full state-wide or cross-department deployment
- Persistent user accounts / stored citizen profiles beyond the session

### 6.3 Future scope (Next / Scale)
- Additional Indian languages, voice-first interaction as the primary mode
- More departments and service categories beyond scholarships/welfare
- State-wide deployment, cross-department navigation
- Reusable Digital Public Infrastructure (DPI) layer
- Official integrations where government access is granted

---

## 7. Functional Requirements

The agent operates as an autonomous loop, not a scripted chatbot: it reasons over context, calls tools, retrieves from trusted sources, and decides the next step.

### 7.1 ASK
- **FR-1:** The system shall accept citizen input as free-text or voice, in any MVP-supported language.
- **FR-2:** The system shall provide a language selector in the interface.

### 7.2 UNDERSTAND
- **FR-3:** The system shall extract intent and citizen profile attributes (e.g., state, income, category, occupation) from the input.
- **FR-4:** When required profile attributes are missing, the system shall ask targeted follow-up questions rather than guessing.

### 7.3 MATCH
- **FR-5:** The system shall retrieve candidate schemes via retrieval-augmented generation (RAG) over a structured scheme database.
- **FR-6:** Retrieval shall be scoped to schemes relevant to the citizen's extracted profile.

### 7.4 VERIFY
- **FR-7:** Every candidate scheme shall be checked against its official source text before being presented.
- **FR-8:** The system shall record and display the source URL and last-verified date for every scheme shown.
- **FR-9:** The system shall never present a scheme recommendation without a cited, verifiable source.

### 7.5 GUIDE
- **FR-10:** The system shall explain, in plain language, why each scheme matches the citizen's profile.
- **FR-11:** The system shall list required documents and next steps for each matched scheme.

### 7.6 ACT
- **FR-12:** The system shall provide a direct link to the official application/service page for each matched scheme.
- **FR-13:** When the system's confidence in a match is low, it shall escalate to official human support rather than presenting an uncertain answer.

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Trust & grounding** | No answer without a cited, verifiable official source |
| **Freshness** | Every result carries a source and a last-verified date |
| **Privacy** | Collect the minimum data necessary for matching; nothing is retained beyond the session |
| **Human oversight** | The agent guides toward official services; it never auto-decides eligibility, and escalates low-confidence cases to humans |
| **Accessibility** | Voice interaction and plain-language output for low-literacy and first-time digital users |
| **Language coverage** | English + one Indian language at MVP; phased, validated expansion afterward |
| **Availability** | Web-based interface, mobile-friendly, usable on common smartphone browsers |
| **Auditability** | Every recommendation traceable end-to-end to its source document and verification timestamp |

---

## 9. System Architecture

```
INTERFACE      React web app · text + voice · language selector
                        │
AI AGENT       Intent & context extraction · eligibility reasoning ·
                tool calling · next-step planning
                        │
TRUST / DATA   Structured scheme database · RAG retrieval ·
                source verification · freshness metadata
                        │
PUBLIC DPI     myScheme · National Portal · official government portals
                        │
ACTION         Verified link to the official application or service
```

**Layer notes:**
- **Interface:** React web app supporting text and voice, with a language selector.
- **AI Agent:** Owns intent extraction, profile-building, eligibility reasoning, tool calling, and next-step planning — the agentic loop (ASK → UNDERSTAND → MATCH → VERIFY → GUIDE → ACT).
- **Trust/Data layer:** A structured, curated scheme database with RAG retrieval, source verification against official text, and freshness metadata (last-verified date) attached to every record.
- **Public DPI:** JanSahay reads from and links to existing Digital Public Infrastructure — myScheme, the National Portal, and other official portals. It does not replace them.
- **Action layer:** Final output is always a verified link to the official application or service, not an in-app submission.

---

## 10. Responsible AI Requirements

| Principle | Commitment |
|---|---|
| **Grounded** | No answer without a cited source |
| **Fresh** | Source + last-verified date on every result |
| **Private** | Minimal data collection; nothing kept beyond the session |
| **No blind automation** | The agent guides citizens to official services; it never auto-decides on their behalf |
| **Human escalation** | Low-confidence cases are routed to official human support |
| **Phased languages** | Launch with English + one Indian language; expand only after validation |

These principles are treated as hard product requirements, not aspirational guidelines — they gate what the agent is allowed to output at every step of the ASK → ACT loop.

---

## 11. Success Metrics (KPIs)

| Metric | What it measures |
|---|---|
| **Scheme-match precision** | Share of presented schemes that are genuinely eligible matches, verified against official criteria |
| **Source-verification coverage** | % of responses that carry a valid source URL + last-verified date (target: 100%) |
| **Discovery-to-application conversion** | % of sessions that end in a citizen clicking through to an official application link (directly addresses the Aware ≠ Applied gap) |
| **Follow-up resolution rate** | % of sessions where missing profile info is successfully resolved via follow-up questions |
| **Escalation rate & resolution** | % of low-confidence sessions correctly escalated to human support, and their resolution outcome |
| **Language coverage adoption** | Usage split between English and the supported Indian language |
| **Session completion time** | Time from first question to receiving a verified official link |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Outdated or incorrect scheme information | Citizen misled, potential real-world harm | Mandatory source + last-verified date on every result; periodic re-verification of the scheme database |
| AI hallucinating eligibility criteria | Wrong guidance, loss of trust | Hard grounding requirement — no answer without a cited source; RAG constrained to the curated database, not open generation |
| Low-confidence matches presented as certain | False expectations, wasted effort by citizen | Explicit escalation to human support below a confidence threshold |
| Language/voice recognition errors for regional accents or dialects | Wrong intent extraction, poor experience for the exact users being served | Phased language rollout with validation before expansion; follow-up questions to confirm ambiguous extractions |
| Over-collection of personal data | Privacy risk, citizen distrust | Minimal-data-collection policy; nothing retained beyond session |
| Users assuming JanSahay *is* the government portal | Confusion, misplaced trust/blame | Clear "what it is / what it is not" messaging in-product; every action ends on an official government domain |
| Scaling scheme database coverage beyond MVP categories | Data quality debt, verification bottleneck | Phased category rollout (scholarships/welfare first), verification pipeline built for reuse across categories |

---

## 13. Assumptions & Dependencies

- Official scheme data (myScheme, National Portal, department portals) remains publicly accessible for retrieval and citation.
- No government-side API access is assumed for the MVP; all handoffs are via public links.
- BHASHINI (MeitY) or equivalent language infrastructure is available for multilingual/voice support as language coverage expands.
- The structured scheme database is curated and maintained by the team (or a future data-partnership) for the MVP's initial categories.

---

## 14. Roadmap

| Phase | Scope |
|---|---|
| **Now (MVP)** | Focused schemes · English + 1 Indian language · core citizen journeys (scholarships, welfare) |
| **Next** | More Indian languages · voice-first interaction · more departments and service categories |
| **Scale** | State-wide deployment · cross-department navigation · reusable DPI layer · official integrations where access is granted |

---

## 15. Intended Impact

| Dimension | Impact |
|---|---|
| **Social** | Accessible, multilingual, plain-language guidance to public services |
| **Economic** | Less friction in accessing entitled benefits |
| **Governance** | Fewer dead-end searches; a reusable navigation layer across states and departments |

---

## 16. Open Questions

- Which single Indian language should be prioritized for MVP launch, and on what basis (population reach, data availability, partner language-tooling support)?
- What confidence threshold triggers human escalation, and who staffs that escalation channel at MVP stage?
- What is the process and cadence for re-verifying scheme data against official sources to guarantee freshness?
- Is there a path to an official data-sharing or listing partnership with myScheme/NeGD/MeitY beyond public retrieval?

---

## 17. Key References

- myScheme (NeGD/MeitY)
- PM-JAY awareness study — PMC10019566 (peer-reviewed)
- "Pushing Welfare" — EDCC 70(2), 2022
- MoSPI CMS:T 2025, via PIB
- MoSPI CAMS 2022–23
- BHASHINI (MeitY)
- IDinsight, 2021
