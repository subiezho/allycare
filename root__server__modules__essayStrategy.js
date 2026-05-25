function buildCoreNarrative(profileAnalysis) {
  const { structuredProfile, uniqueAdvantages, strengths } = profileAnalysis;
  const primaryMajor = structuredProfile.intendedMajors[0] || "your intended field";

  return {
    hook: `Anchor the personal statement in a concrete moment that triggered sustained interest in ${primaryMajor}.`,
    storyline: [
      "Problem or challenge you observed directly",
      "Action you took with increasing complexity",
      "Measurable outcome and what changed for others",
      "Intellectual questions that now drive your university goals"
    ],
    differentiators: uniqueAdvantages,
    supportingSignals: strengths
  };
}

function supplementalStrategy(intendedMajors) {
  const major = intendedMajors[0] || "your intended area";

  return [
    `Why major essays: connect prior coursework/projects to specific unresolved questions in ${major}.`,
    "Why us essays: reference 2-3 programs/labs/professors and explain tactical fit, not generic prestige.",
    "Community essays: show what you will build on campus based on evidence from past contribution.",
    "Challenge/failure essays: emphasize iteration and decision quality rather than dramatic storytelling."
  ];
}

function essayQualityRubric() {
  return {
    originality: "Avoid common high-achiever tropes; use scene + reflection + insight progression.",
    authenticity: "Use concrete details and self-critical reflection; avoid resume repetition.",
    intellectualCuriosity: "Show how questions evolved and where they lead academically.",
    emotionalImpact: "Demonstrate stakes through lived specifics, not broad claims.",
    missionAlignment: "Align values with each institution's opportunities and community culture."
  };
}

export function generateEssayStrategy(profileAnalysis) {
  const { structuredProfile, weaknesses } = profileAnalysis;

  const riskMitigations = [];
  if (weaknesses.some((item) => item.toLowerCase().includes("academic"))) {
    riskMitigations.push("Use additional information section to explain context and highlight academic trend or rigor trajectory.");
  }

  if (weaknesses.some((item) => item.toLowerCase().includes("activities"))) {
    riskMitigations.push("Choose one high-impact activity as the central thread and quantify outcomes to improve credibility.");
  }

  return {
    personalStatementStrategy: buildCoreNarrative(profileAnalysis),
    supplementalEssayStrategy: supplementalStrategy(structuredProfile.intendedMajors),
    qualityRubric: essayQualityRubric(),
    riskMitigations: riskMitigations.length ? riskMitigations : ["Ensure every essay advances a distinct dimension of your profile."]
  };
}
