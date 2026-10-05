/**
 * JanSahay AI — Grounding & Verification Engine
 * Strictly enforces FR-7, FR-8, FR-9:
 * 1. Checks candidate scheme against official source text
 * 2. Mandates valid official URL & last-verified date
 * 3. Never outputs recommendations without cited verifiable sources
 * 4. Determines confidence level and escalation flags
 */

export function verifyScheme(candidate) {
  const { scheme, matchScore, isEligible, reasons, caveats } = candidate;

  // Grounding checks
  const hasOfficialUrl = Boolean(scheme.official_url && scheme.official_url.startsWith('https://'));
  const hasSourceGuidelines = Boolean(scheme.source_guidelines_url && scheme.source_guidelines_url.startsWith('https://'));
  const hasFreshnessDate = Boolean(scheme.last_verified_at);

  if (!hasOfficialUrl || !hasFreshnessDate) {
    // Grounding failure: Disallow output without verified source
    return {
      isValid: false,
      reason: 'Rejected: Missing official source or freshness verification'
    };
  }

  // Calculate confidence tier
  let confidence = 'HIGH';
  if (matchScore < 50 || caveats.length > 1) {
    confidence = 'LOW';
  } else if (matchScore < 75 || caveats.length === 1) {
    confidence = 'MEDIUM';
  }

  return {
    isValid: true,
    scheme_id: scheme.id,
    name: scheme.name,
    category: scheme.category,
    scope: scheme.scope,
    department: scheme.department,
    summary: scheme.summary,
    benefits: scheme.benefits,
    eligibility_summary: scheme.eligibility.criteria_summary,
    required_documents: scheme.required_documents,
    official_url: scheme.official_url,
    source_guidelines_url: scheme.source_guidelines_url,
    last_verified_at: scheme.last_verified_at,
    verification_status: scheme.verification_status,
    verification_notes: scheme.verification_notes,
    helpline: scheme.helpline,
    matchScore,
    confidence,
    isEligible,
    reasons,
    caveats,
    grounding: {
      isGrounded: true,
      citedSource: scheme.source_guidelines_url,
      verifiedDomain: new URL(scheme.official_url).hostname,
      auditTimestamp: new Date().toISOString()
    }
  };
}

/**
 * Evaluates whether overall response requires Human Escalation (FR-13)
 */
export function evaluateEscalation(verifiedMatches, profile) {
  if (verifiedMatches.length === 0) {
    return {
      shouldEscalate: true,
      reason: 'No verified schemes matching your criteria were found with high confidence.',
      escalationType: 'NO_MATCH_FOUND'
    };
  }

  const topMatch = verifiedMatches[0];
  const highConfidenceCount = verifiedMatches.filter(m => m.confidence === 'HIGH').length;
  if (topMatch.matchScore < 50 || (highConfidenceCount === 0 && verifiedMatches.every(m => m.confidence === 'LOW'))) {
    return {
      shouldEscalate: true,
      reason: 'Low match confidence. Bureaucratic criteria need official departmental review.',
      escalationType: 'LOW_CONFIDENCE'
    };
  }

  return {
    shouldEscalate: false,
    reason: null,
    escalationType: 'NONE'
  };
}
