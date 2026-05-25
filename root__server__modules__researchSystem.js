import { UNIVERSITY_DATA } from "../config/universities.js";

function computePortfolioDistribution(universities) {
  const distribution = { highSelectivity: 0, mediumSelectivity: 0, broadSelectivity: 0 };

  for (const university of universities) {
    if (university.acceptanceRate <= 0.12) {
      distribution.highSelectivity += 1;
    } else if (university.acceptanceRate <= 0.3) {
      distribution.mediumSelectivity += 1;
    } else {
      distribution.broadSelectivity += 1;
    }
  }

  return distribution;
}

function admissionTrendSignals(intendedMajors) {
  const majors = intendedMajors.map((major) => major.toLowerCase());
  const trends = [];

  if (majors.some((major) => /computer|data|engineering|ai|machine learning|software/.test(major))) {
    trends.push("STEM-heavy majors continue to see applicant volume inflation, so academic rigor plus project evidence is critical.");
  }

  if (majors.some((major) => /business|economics|finance/.test(major))) {
    trends.push("Business/econ pipelines are saturated at top institutions; leadership plus quant competence is a key differentiator.");
  }

  if (majors.some((major) => /political|international|public policy|global/.test(major))) {
    trends.push("Policy-oriented majors benefit significantly from civic impact, debate/publication, and multilingual/global context.");
  }

  if (trends.length === 0) {
    trends.push("Major-specific evidence is increasingly important across all selective US institutions.");
  }

  trends.push("For international applicants needing aid, competition is materially tougher than headline acceptance rates suggest.");

  return trends;
}

function buildInstitutionSnapshots(recommendations) {
  const names = new Set([
    ...recommendations.reach.map((u) => u.name),
    ...recommendations.target.map((u) => u.name),
    ...recommendations.safety.map((u) => u.name)
  ]);

  return UNIVERSITY_DATA
    .filter((university) => names.has(university.name))
    .slice(0, 10)
    .map((university) => ({
      name: university.name,
      acceptanceRate: `${Math.round(university.acceptanceRate * 100)}%`,
      aidGenerosityScore: university.aidGenerosity,
      meritAid: university.meritAid ? "Available" : "Limited/None",
      strategicNote:
        university.acceptanceRate <= 0.1
          ? "Treat as high-variance admissions; essay and recommendations are decisive."
          : university.meritAid
            ? "Strong candidate for scholarship optimization with early submission."
            : "Prioritize fit clarity and affordability checks early."
    }));
}

export function generateUniversityResearch(profileAnalysis, recommendations) {
  const selectedUniversities = [
    ...recommendations.reach,
    ...recommendations.target,
    ...recommendations.safety
  ];

  return {
    portfolioDistribution: computePortfolioDistribution(selectedUniversities),
    trendSignals: admissionTrendSignals(profileAnalysis.structuredProfile.intendedMajors),
    institutionSnapshots: buildInstitutionSnapshots(recommendations)
  };
}
