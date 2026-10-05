/**
 * JanSahay AI — Scheme Matcher (RAG Retrieval Engine)
 * Evaluates candidate schemes against extracted citizen profile and search query.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/schemes.json'), 'utf-8')
);

export function matchSchemes(profile = {}, query = '') {
  const queryLower = (query || '').toLowerCase();

  const results = schemesData.map((scheme) => {
    let score = 0;
    const reasons = [];
    const caveats = [];
    let isEligible = true;

    // 1. Occupation / Target Group alignment
    if (profile.occupation && scheme.eligibility?.occupations) {
      const isExplicitMatch = scheme.eligibility.occupations.some(
        (o) => o.toLowerCase() === profile.occupation.toLowerCase()
      );
      const isUniversal = scheme.eligibility.occupations.includes('All');

      if (isExplicitMatch) {
        score += 35;
        reasons.push(`Matches target occupation: ${profile.occupation}`);
      } else if (isUniversal) {
        score += 10;
      } else {
        score -= 20;
        isEligible = false;
        caveats.push(`Intended for ${scheme.target_group}, but citizen identified as ${profile.occupation}`);
      }
    }

    // 2. State & Scope alignment
    if (scheme.eligibility?.states) {
      if (profile.state) {
        const stateMatch = scheme.eligibility.states.includes('All') || 
                           scheme.eligibility.states.includes(profile.state);
        if (stateMatch) {
          score += 25;
          reasons.push(`Applicable in your state: ${profile.state}`);
        } else {
          score -= 40;
          isEligible = false;
          caveats.push(`Scheme is exclusive to ${scheme.eligibility.states.join(', ')}`);
        }
      } else {
        // If state is not specified, all-india gets slight bump
        if (scheme.eligibility.states.includes('All')) {
          score += 15;
        }
      }
    }

    // 3. Category / Caste alignment
    if (profile.category && scheme.eligibility?.categories) {
      const catMatch = scheme.eligibility.categories.includes('All') ||
                        scheme.eligibility.categories.includes(profile.category);
      if (catMatch) {
        score += 20;
        reasons.push(`Supports category: ${profile.category}`);
      } else {
        // Minority check
        if (scheme.id === 'nsp-postmatric-minority' && profile.category !== 'Minority') {
          score -= 30;
          isEligible = false;
          caveats.push('Specifically reserved for notified minority communities');
        }
      }
    }

    // 4. Annual Income ceiling check
    if (profile.annual_income && scheme.eligibility.max_annual_income) {
      if (profile.annual_income <= scheme.eligibility.max_annual_income) {
        score += 20;
        reasons.push(`Annual income ₹${profile.annual_income.toLocaleString('en-IN')} is within ₹${scheme.eligibility.max_annual_income.toLocaleString('en-IN')} limit`);
      } else {
        score -= 35;
        isEligible = false;
        caveats.push(`Family income exceeds the ceiling limit of ₹${scheme.eligibility.max_annual_income.toLocaleString('en-IN')}`);
      }
    }

    // 5. Gender check
    if (scheme.eligibility.gender && profile.gender) {
      if (scheme.eligibility.gender.toLowerCase() === profile.gender.toLowerCase()) {
        score += 15;
        reasons.push(`Matches eligible gender: ${profile.gender}`);
      } else {
        isEligible = false;
        score -= 30;
        caveats.push(`Dedicated benefit for ${scheme.eligibility.gender} heads of households`);
      }
    }

    // 6. Land ownership
    if (scheme.eligibility.land_ownership) {
      if (profile.land_ownership === true) {
        score += 20;
        reasons.push('Verified landholder criteria met');
      } else if (profile.land_ownership === false) {
        isEligible = false;
        score -= 30;
        caveats.push('Requires documented agricultural land ownership');
      }
    }

    // 7. Keyword query boost
    const searchableText = `${scheme.id} ${JSON.stringify(scheme.name)} ${JSON.stringify(scheme.summary)} ${scheme.category}`.toLowerCase();
    if (queryLower.split(/\s+/).some(word => word.length > 3 && searchableText.includes(word))) {
      score += 15;
    }

    // Normalized match score bounded [0, 100]
    const normalizedScore = Math.max(0, Math.min(100, score));

    return {
      scheme,
      isEligible: isEligible && normalizedScore >= 40,
      matchScore: normalizedScore,
      reasons,
      caveats
    };
  });

  // Sort by match score descending
  return results
    .filter(r => r.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getAllSchemes() {
  return schemesData;
}
