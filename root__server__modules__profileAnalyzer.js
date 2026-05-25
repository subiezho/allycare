function pickFirstNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? Number(match[1]) : null;
}

function parseBudget(text) {
  const budgetPatterns = [
    /budget[^\d]*(\d{1,3}(?:[,\s]\d{3})+)/i,
    /(?:can pay|afford)[^\d]*(\d{1,3}(?:[,\s]\d{3})+)/i,
    /\$(\d{1,3}(?:[,\s]\d{3})+)/i
  ];

  for (const pattern of budgetPatterns) {
    const match = text.match(pattern);
    if (match) {
      return Number(match[1].replace(/[,\s]/g, ""));
    }
  }

  return null;
}

function parseList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 10);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(/[\n,;/|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function parseMajors(rawMajors, profileText) {
  const source = rawMajors || profileText;
  if (!source) {
    return [];
  }

  const majorMatch = String(source).match(/(?:major|intended major|interested in|field)[:\-\s]*(.+)/i);
  const majorsText = majorMatch ? majorMatch[1] : String(source);

  return majorsText
    .split(/[\n,;/|]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);
}

function extractActivities(profileText, profileActivities) {
  if (Array.isArray(profileActivities) && profileActivities.length > 0) {
    return profileActivities.slice(0, 10);
  }

  if (!profileText) {
    return [];
  }

  return profileText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 10)
    .filter((line) => /^[-*\d.)]|club|research|founded|captain|president|intern|volunteer|project|olympiad/i.test(line))
    .slice(0, 10);
}

function calculateAcademicScore({ gpa, sat, act, toefl, ielts, duolingo, courseRigor }) {
  let score = 45;

  if (typeof gpa === "number") {
    if (gpa >= 3.95) score += 25;
    else if (gpa >= 3.85) score += 20;
    else if (gpa >= 3.7) score += 14;
    else if (gpa >= 3.5) score += 10;
    else if (gpa >= 3.3) score += 6;
  }

  if (typeof sat === "number") {
    if (sat >= 1540) score += 20;
    else if (sat >= 1490) score += 16;
    else if (sat >= 1440) score += 12;
    else if (sat >= 1380) score += 8;
    else if (sat >= 1300) score += 5;
  }

  if (typeof act === "number") {
    if (act >= 35) score += 20;
    else if (act >= 33) score += 16;
    else if (act >= 31) score += 12;
    else if (act >= 29) score += 8;
    else if (act >= 26) score += 5;
  }

  if (typeof toefl === "number") {
    if (toefl >= 110) score += 8;
    else if (toefl >= 102) score += 6;
    else if (toefl >= 95) score += 4;
  }

  if (typeof ielts === "number") {
    if (ielts >= 8) score += 8;
    else if (ielts >= 7.5) score += 6;
    else if (ielts >= 7) score += 4;
  }

  if (typeof duolingo === "number") {
    if (duolingo >= 145) score += 6;
    else if (duolingo >= 130) score += 4;
    else if (duolingo >= 120) score += 2;
  }

  if (typeof courseRigor === "number") {
    score += Math.max(0, Math.min(10, courseRigor));
  }

  return Math.max(0, Math.min(100, score));
}

function calculateActivitiesScore(activities, profileText) {
  const text = profileText.toLowerCase();
  const leadershipHits = (text.match(/founder|co-founder|president|captain|lead|chair|director/g) || []).length;
  const impactHits = (text.match(/raised|served|students|community|published|award|winner|national|international|research/g) || []).length;

  let score = 35;
  score += Math.min(25, activities.length * 3);
  score += Math.min(20, leadershipHits * 4);
  score += Math.min(20, impactHits * 2);

  return Math.max(0, Math.min(100, score));
}

function calculateContextScore({ firstGen, lowIncome, personalContext }, profileText) {
  let score = 50;

  if (firstGen) score += 10;
  if (lowIncome) score += 12;
  if (personalContext) score += 8;

  const contextKeywords = /refugee|rural|underserved|family responsibility|caregiver|war|displacement|hardship/i;
  if (contextKeywords.test(profileText)) {
    score += 10;
  }

  return Math.max(20, Math.min(100, score));
}

function buildStrengths({ academicsScore, activitiesScore, contextScore, structuredProfile, activities }) {
  const strengths = [];

  if (academicsScore >= 80) {
    strengths.push("Academic metrics are competitive for highly selective US universities.");
  }

  if (activitiesScore >= 75) {
    strengths.push("Extracurricular profile shows strong depth, leadership, or measurable impact.");
  }

  if (activities.some((a) => /research|publication|paper|olympiad|hackathon/i.test(a))) {
    strengths.push("Profile includes high-signal achievements (research/competitions/technical work).");
  }

  if (structuredProfile.needFinancialAid) {
    strengths.push("Aid need is clearly stated, enabling precise need-based and merit strategy.");
  }

  if (contextScore >= 65) {
    strengths.push("Personal context can support a compelling narrative in essays and recommendations.");
  }

  if (strengths.length === 0) {
    strengths.push("Baseline profile is usable; strategic positioning can improve competitiveness.");
  }

  return strengths;
}

function buildWeaknesses({ academicsScore, activitiesScore, structuredProfile }) {
  const weaknesses = [];

  if (academicsScore < 65) {
    weaknesses.push("Academic metrics are currently below common thresholds for Top-30 admissions.");
  }

  if (!structuredProfile.sat && !structuredProfile.act) {
    weaknesses.push("No standardized test score provided; this weakens leverage at score-sensitive schools.");
  }

  if (activitiesScore < 60) {
    weaknesses.push("Activities may read as broad but not deep; selective schools need stronger spike evidence.");
  }

  if (!structuredProfile.intendedMajors.length) {
    weaknesses.push("Intended academic direction is unclear, which can weaken program fit narrative.");
  }

  return weaknesses;
}

function buildRisks({ structuredProfile, competitivenessScore, weaknesses }) {
  const risks = [];

  if (structuredProfile.needFinancialAid && competitivenessScore < 80) {
    risks.push("High aid need plus moderate profile strength increases risk at need-aware private universities.");
  }

  if (weaknesses.length >= 2) {
    risks.push("Application may be evaluated as inconsistent unless academic and extracurricular signals are aligned.");
  }

  if (!structuredProfile.englishTest && structuredProfile.isInternational) {
    risks.push("Missing English proficiency score may create eligibility friction for some programs.");
  }

  return risks;
}

function buildUniqueAdvantages(structuredProfile, activities) {
  const advantages = [];
  const text = `${structuredProfile.profileText} ${activities.join(" ")}`.toLowerCase();

  if (/startup|business|founded|launched/.test(text)) {
    advantages.push("Entrepreneurial evidence can differentiate essays and supplementals.");
  }

  if (/research|publication|journal|patent|paper/.test(text)) {
    advantages.push("Research-oriented positioning can strengthen applications to selective STEM/social science programs.");
  }

  if (/nonprofit|community|initiative|impact/.test(text)) {
    advantages.push("Demonstrated community impact can support both admissions and scholarship committees.");
  }

  if (/olympiad|national|international|medal|winner/.test(text)) {
    advantages.push("Recognized competition outcomes create strong third-party validation.");
  }

  if (advantages.length === 0) {
    advantages.push("Narrative coherence and clear fit strategy can become the main differentiator.");
  }

  return advantages;
}

export function normalizeStudentProfile(payload = {}) {
  const profileText = String(payload.profileText || payload.profile || "").trim();
  const profile = payload.profile || {};
  const mergedText = `${profileText}\n${JSON.stringify(profile)}`;

  const gpa = typeof profile.gpa === "number" ? profile.gpa : pickFirstNumber(mergedText, /gpa[^\d]*(\d\.\d{1,2})/i);
  const sat = typeof profile.sat === "number" ? profile.sat : pickFirstNumber(mergedText, /sat[^\d]*(\d{3,4})/i);
  const act = typeof profile.act === "number" ? profile.act : pickFirstNumber(mergedText, /act[^\d]*(\d{1,2})/i);
  const toefl = typeof profile.toefl === "number" ? profile.toefl : pickFirstNumber(mergedText, /toefl[^\d]*(\d{2,3})/i);
  const ielts = typeof profile.ielts === "number" ? profile.ielts : pickFirstNumber(mergedText, /ielts[^\d]*(\d(?:\.\d)?)/i);
  const duolingo = typeof profile.duolingo === "number" ? profile.duolingo : pickFirstNumber(mergedText, /duolingo[^\d]*(\d{2,3})/i);

  const grade = profile.currentGrade || profile.grade || (mergedText.match(/(?:grade|class)\s*(9|10|11|12)/i)?.[1] || null);
  const graduationYear = profile.graduationYear || pickFirstNumber(mergedText, /(20\d{2})/);
  const budgetUsd = typeof profile.budgetUsd === "number" ? profile.budgetUsd : parseBudget(mergedText);
  const weeklyHours = typeof profile.weeklyHours === "number"
    ? profile.weeklyHours
    : pickFirstNumber(mergedText, /(\d{1,2})\s*(?:hours?|hrs?)\s*(?:per|\/)\s*week/i);

  const intendedMajors = parseMajors(profile.intendedMajors, profileText);
  const activities = extractActivities(profileText, profile.activities);
  const opportunities = parseList(profile.opportunities);
  const constraints = parseList(profile.constraints);

  const needFinancialAid = typeof profile.needFinancialAid === "boolean"
    ? profile.needFinancialAid
    : /financial aid|full ride|scholarship|need aid|cannot afford|need-based/i.test(mergedText) ||
      (typeof budgetUsd === "number" && budgetUsd < 45000);

  const isInternational = typeof profile.isInternational === "boolean"
    ? profile.isInternational
    : /international|outside us|non-us|citizenship/i.test(mergedText) || !!profile.citizenship;

  return {
    name: profile.name || "Student",
    citizenship: profile.citizenship || "Not specified",
    currentGrade: grade ? String(grade) : "Not specified",
    graduationYear: graduationYear || null,
    intendedMajors,
    gpa,
    sat,
    act,
    toefl,
    ielts,
    duolingo,
    englishTest: toefl || ielts || duolingo ? { toefl, ielts, duolingo } : null,
    courseRigor: typeof profile.courseRigor === "number" ? profile.courseRigor : null,
    activities,
    opportunities,
    constraints,
    weeklyHours,
    budgetUsd,
    needFinancialAid,
    isInternational,
    firstGen: Boolean(profile.firstGen),
    lowIncome: Boolean(profile.lowIncome),
    personalContext: profile.personalContext || "",
    profileText,
    question: payload.question || ""
  };
}

export function analyzeStudentProfile(payload = {}) {
  const structuredProfile = normalizeStudentProfile(payload);
  const academicsScore = calculateAcademicScore(structuredProfile);
  const activitiesScore = calculateActivitiesScore(structuredProfile.activities, structuredProfile.profileText.toLowerCase());
  const contextScore = calculateContextScore(structuredProfile, structuredProfile.profileText);

  const overallScore = Math.round(academicsScore * 0.5 + activitiesScore * 0.35 + contextScore * 0.15);

  const strengths = buildStrengths({
    academicsScore,
    activitiesScore,
    contextScore,
    structuredProfile,
    activities: structuredProfile.activities
  });

  const weaknesses = buildWeaknesses({ academicsScore, activitiesScore, structuredProfile });
  const uniqueAdvantages = buildUniqueAdvantages(structuredProfile, structuredProfile.activities);
  const admissionRisks = buildRisks({ structuredProfile, competitivenessScore: overallScore, weaknesses });

  return {
    structuredProfile,
    scores: {
      academics: academicsScore,
      extracurriculars: activitiesScore,
      context: contextScore,
      overall: overallScore
    },
    strengths,
    weaknesses,
    uniqueAdvantages,
    admissionRisks
  };
}
