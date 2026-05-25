import { AID_POLICY_LABELS, UNIVERSITY_DATA } from "../config/universities.js";

function buildBudgetBand(budgetUsd, needAid) {
  if (!needAid) return "Self-funded or limited-aid strategy possible";
  if (typeof budgetUsd !== "number") return "High-aid required (budget not specified)";
  if (budgetUsd <= 15000) return "Very high aid need (near full-ride requirement)";
  if (budgetUsd <= 30000) return "High aid need";
  if (budgetUsd <= 50000) return "Moderate aid need";
  return "Partial aid need";
}

function prioritizeAidUniversities(isInternational) {
  return UNIVERSITY_DATA
    .map((university) => {
      let score = university.aidGenerosity * 10;

      if (isInternational) {
        if (university.intlAidPolicy === "need-blind-full-need") score += 40;
        else if (university.intlAidPolicy === "need-aware-full-need") score += 25;
        else if (university.intlAidPolicy === "need-aware-strong") score += 15;
        else if (university.intlAidPolicy === "need-aware-high-aid") score += 20;
        else score -= 20;
      }

      if (university.meritAid) {
        score += 8;
      }

      return {
        name: university.name,
        aidPolicy: AID_POLICY_LABELS[university.intlAidPolicy],
        meritAid: university.meritAid,
        aidPriorityScore: score
      };
    })
    .sort((a, b) => b.aidPriorityScore - a.aidPriorityScore)
    .slice(0, 12);
}

function externalScholarships(isInternational) {
  if (isInternational) {
    return [
      "EducationUSA Opportunity Funds (country-dependent)",
      "Fulbright Foreign Student Program (eligible countries)",
      "Joint Japan/World Bank Scholarship (graduate-focused, future option)",
      "Mastercard Foundation partner opportunities (selected institutions)",
      "Local government/ministry merit programs tied to return-service"
    ];
  }

  return [
    "QuestBridge National College Match",
    "Gates Scholarship",
    "Coca-Cola Scholars Program",
    "Jack Kent Cooke Foundation Scholarship",
    "State and community foundation scholarship portfolios"
  ];
}

export function generateFinancialAidStrategy(profileAnalysis, recommendations) {
  const { structuredProfile } = profileAnalysis;

  const budgetBand = buildBudgetBand(structuredProfile.budgetUsd, structuredProfile.needFinancialAid);
  const rankedAidSchools = prioritizeAidUniversities(structuredProfile.isInternational);

  const portfolioAdvice = [
    "Keep at least 4 universities with strong need-based support for your profile.",
    "Include 4-6 universities where merit scholarships are realistic and application is automatic or early priority.",
    "Maintain 3+ financially safer options with high admission probability and transparent scholarship grids."
  ];

  if (structuredProfile.needFinancialAid && structuredProfile.isInternational) {
    portfolioAdvice.push("Avoid an application list dominated by need-aware, low-aid private schools unless profile is exceptional.");
  }

  const tacticChecklist = [
    "Track CSS Profile/ISFAA/IDOC requirements by university and deadline.",
    "Prepare clear financial documentation (income statements, currency conversion, bank statements).",
    "Submit merit-scholarship essays before priority deadlines, often earlier than regular application deadlines.",
    "Prioritize Early Action where scholarships are front-loaded but avoid binding Early Decision if aid certainty is low.",
    "Build a scholarship calendar with weekly submissions for external awards."
  ];

  return {
    budgetBand,
    rankedAidUniversities: rankedAidSchools,
    recommendedFinancialMix: {
      reachCount: recommendations.reach.length,
      targetCount: recommendations.target.length,
      safetyCount: recommendations.safety.length
    },
    portfolioAdvice,
    externalScholarships: externalScholarships(structuredProfile.isInternational),
    tacticChecklist
  };
}
