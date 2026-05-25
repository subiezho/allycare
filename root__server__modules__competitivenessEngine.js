function scoreToBand(score) {
  if (score >= 88) return "Elite competitive";
  if (score >= 78) return "Highly competitive";
  if (score >= 68) return "Competitive";
  if (score >= 58) return "Developing competitive";
  return "Needs major strengthening";
}

function estimateTierProbability(baseScore, selectivityPenalty, aidPenalty) {
  const adjusted = Math.max(1, Math.min(95, Math.round(baseScore - selectivityPenalty - aidPenalty)));

  if (adjusted >= 80) return "High";
  if (adjusted >= 60) return "Moderate";
  if (adjusted >= 40) return "Low";
  return "Very Low";
}

export function evaluateCompetitiveness(profileAnalysis) {
  const { structuredProfile, scores } = profileAnalysis;
  const overall = scores.overall;

  const aidPenalty = structuredProfile.needFinancialAid && structuredProfile.isInternational ? 10 : 4;

  const tiers = [
    {
      tier: "Ivy+ / Top 10",
      competitivenessScore: Math.max(1, overall - 22 - aidPenalty),
      estimatedChanceBand: estimateTierProbability(overall, 22, aidPenalty),
      notes: "Requires near-flawless academics, high-impact spike, and strong institutional fit narrative."
    },
    {
      tier: "Top 20-30",
      competitivenessScore: Math.max(1, overall - 12 - aidPenalty),
      estimatedChanceBand: estimateTierProbability(overall, 12, aidPenalty),
      notes: "Strong academics and differentiated profile can convert if essays and recommendations are excellent."
    },
    {
      tier: "Top 40-60",
      competitivenessScore: Math.max(1, overall - 4 - aidPenalty / 2),
      estimatedChanceBand: estimateTierProbability(overall, 4, aidPenalty / 2),
      notes: "Balanced list strategy with clear major fit and scholarship targeting can produce solid outcomes."
    },
    {
      tier: "Selective scholarship-heavy universities",
      competitivenessScore: Math.max(1, overall - 6),
      estimatedChanceBand: estimateTierProbability(overall, 6, 0),
      notes: "Merit scholarship competition can be more intense than base admission rates imply."
    }
  ];

  return {
    overallScore: overall,
    competitivenessBand: scoreToBand(overall),
    internationalDifficulty: structuredProfile.isInternational ? "High" : "Moderate",
    aidComplexity: structuredProfile.needFinancialAid ? "High" : "Moderate",
    tiers
  };
}
