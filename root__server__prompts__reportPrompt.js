export function buildAdmissionsPrompt(payload) {
  const {
    profileAnalysis,
    competitiveness,
    recommendations,
    financialAid,
    extracurricularStrategy,
    timeline,
    essayStrategy,
    research
  } = payload;

  return `Generate the final strategic report using this analysis payload.

Student Profile Analysis:
${JSON.stringify(profileAnalysis, null, 2)}

Competitiveness:
${JSON.stringify(competitiveness, null, 2)}

University Recommendations:
${JSON.stringify(recommendations, null, 2)}

Financial Aid Strategy:
${JSON.stringify(financialAid, null, 2)}

Extracurricular Activities Strategy:
${JSON.stringify(extracurricularStrategy, null, 2)}

Application Timeline:
${JSON.stringify(timeline, null, 2)}

Essay Strategy:
${JSON.stringify(essayStrategy, null, 2)}

University Research Insights:
${JSON.stringify(research, null, 2)}

User Question:
${profileAnalysis.structuredProfile.question || "No explicit question provided."}

Output requirements:
- Follow the required seven top-level sections exactly.
- Use clear priorities and concrete steps.
- Include a shortlist of highest-leverage actions for the next 30 days.
- In extracurricular section, keep each recommendation short and specific (what to do, expected result, where to do it).
- Keep language professional and strategic.`;
}
