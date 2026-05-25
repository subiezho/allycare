function formatUniversityList(items) {
  return items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} (${item.acceptanceRate}) - ${item.reason}. Aid: ${item.aidPolicy}.`
    )
    .join("\n");
}

function formatList(title, values) {
  if (!values || values.length === 0) {
    return `${title}\n- None identified.`;
  }
  return `${title}\n${values.map((value) => `- ${value}`).join("\n")}`;
}

export function composeStructuredFallbackReport(data) {
  const {
    profileAnalysis,
    competitiveness,
    recommendations,
    financialAid,
    extracurricularStrategy,
    timeline,
    essayStrategy,
    research
  } = data;

  const { structuredProfile, scores, strengths, weaknesses, uniqueAdvantages, admissionRisks } = profileAnalysis;

  return `# US Admissions Strategic Report

## 1. Situation Analysis
Applicant: ${structuredProfile.name}
Citizenship: ${structuredProfile.citizenship}
Current Grade: ${structuredProfile.currentGrade}
Intended Majors: ${structuredProfile.intendedMajors.join(", ") || "Not specified"}
Financial Context: ${financialAid.budgetBand}

${formatList("Strengths", strengths)}

${formatList("Weaknesses", weaknesses)}

${formatList("Unique Advantages", uniqueAdvantages)}

${formatList("Admission Risks", admissionRisks)}

## 2. Competitiveness Evaluation
Overall Competitiveness Score: ${scores.overall}/100 (${competitiveness.competitivenessBand})
Academic Score: ${scores.academics}/100
Extracurricular Score: ${scores.extracurriculars}/100
Context Score: ${scores.context}/100

${competitiveness.tiers
  .map(
    (tier) =>
      `- ${tier.tier}: ${tier.competitivenessScore}/100 (${tier.estimatedChanceBand}). ${tier.notes}`
  )
  .join("\n")}

## 3. Reach / Target / Safety Universities
### Reach
${formatUniversityList(recommendations.reach)}

### Target
${formatUniversityList(recommendations.target)}

### Safety
${formatUniversityList(recommendations.safety)}

## 4. Financial Aid Strategy
- Portfolio Mix: Reach ${financialAid.recommendedFinancialMix.reachCount}, Target ${financialAid.recommendedFinancialMix.targetCount}, Safety ${financialAid.recommendedFinancialMix.safetyCount}

${formatList("Financial Aid Portfolio Advice", financialAid.portfolioAdvice)}

${formatList("Execution Checklist", financialAid.tacticChecklist)}

Top Aid-Friendly Universities:
${financialAid.rankedAidUniversities
  .map((u, i) => `- ${i + 1}. ${u.name}: ${u.aidPolicy}`)
  .join("\n")}

External Scholarship Targets:
${financialAid.externalScholarships.map((s) => `- ${s}`).join("\n")}

## 5. Extracurricular Activities Strategy
- Focus Area: ${extracurricularStrategy.focusArea}
- Current Activity Count: ${extracurricularStrategy.profileSignals.currentActivitiesCount}
- Weekly Hours: ${extracurricularStrategy.profileSignals.weeklyHours}

Recommended Tracks:
${extracurricularStrategy.concreteRecommendations
  .map(
    (item, index) =>
      `${index + 1}. ${item.title} - ${item.why}
   Actions: ${item.actions.join(" | ")}
   Metric: ${item.metrics}
   Resources: ${item.resources.map((r) => `${r.name} (${r.url})`).join(", ")}`
  )
  .join("\n")}

Next 30 Days:
${extracurricularStrategy.concreteNext30Days.map((item) => `- ${item}`).join("\n")}

Missing Opportunity Inputs:
${extracurricularStrategy.clarifyingQuestions.length
  ? extracurricularStrategy.clarifyingQuestions.map((q) => `- ${q}`).join("\n")
  : "- Enough opportunity/constraint detail provided."}

## 6. Application Timeline
### Grade 9
${timeline.multiYearPlan.grade9.map((item) => `- ${item}`).join("\n")}

### Grade 10
${timeline.multiYearPlan.grade10.map((item) => `- ${item}`).join("\n")}

### Grade 11
${timeline.multiYearPlan.grade11.map((item) => `- ${item}`).join("\n")}

### Grade 12
${timeline.multiYearPlan.grade12.map((item) => `- ${item}`).join("\n")}

### Next 90 Days
${timeline.next90Days
  .map((phase) => `- ${phase.month}: ${phase.priorities.join(" | ")}`)
  .join("\n")}

## 7. Advanced Recommendations
Essay Strategy:
- Personal statement hook: ${essayStrategy.personalStatementStrategy.hook}
- Supplemental priorities:
${essayStrategy.supplementalEssayStrategy.map((item) => `  - ${item}`).join("\n")}
- Risk mitigation:
${essayStrategy.riskMitigations.map((item) => `  - ${item}`).join("\n")}

Research Insights:
- Portfolio Selectivity Mix: High ${research.portfolioDistribution.highSelectivity}, Medium ${research.portfolioDistribution.mediumSelectivity}, Broad ${research.portfolioDistribution.broadSelectivity}
${research.trendSignals.map((signal) => `- ${signal}`).join("\n")}

Institution Snapshots:
${research.institutionSnapshots
  .map(
    (item) =>
      `- ${item.name}: acceptance ${item.acceptanceRate}, aid score ${item.aidGenerosityScore}, merit ${item.meritAid}. ${item.strategicNote}`
  )
  .join("\n")}
`;
}
