import { AID_POLICY_LABELS, UNIVERSITY_DATA } from "../config/universities.js";

function computeSchoolDifficulty(acceptanceRate) {
  if (acceptanceRate <= 0.05) return 92;
  if (acceptanceRate <= 0.08) return 84;
  if (acceptanceRate <= 0.12) return 76;
  if (acceptanceRate <= 0.18) return 68;
  if (acceptanceRate <= 0.3) return 58;
  if (acceptanceRate <= 0.5) return 48;
  return 36;
}

function computeMajorFit(strengths, intendedMajors) {
  if (!intendedMajors.length) {
    return 5;
  }

  const lowered = strengths.map((item) => item.toLowerCase());
  const direct = intendedMajors.filter((major) => lowered.some((s) => s.includes(major))).length;

  if (direct >= 2) return 20;
  if (direct === 1) return 14;

  const stemSignals = /engineering|computer science|math|physics|data/i;
  const userWantsStem = intendedMajors.some((major) => stemSignals.test(major));
  const schoolStrongStem = strengths.some((major) => stemSignals.test(major));

  if (userWantsStem && schoolStrongStem) return 10;
  return 4;
}

function computeAidFit(university, structuredProfile) {
  let score = university.aidGenerosity * 2;

  if (!structuredProfile.needFinancialAid) {
    score += university.meritAid ? 4 : 2;
    return score;
  }

  if (structuredProfile.isInternational) {
    if (university.intlAidPolicy === "need-blind-full-need") score += 18;
    else if (university.intlAidPolicy === "need-aware-full-need") score += 12;
    else if (university.intlAidPolicy === "need-aware-strong") score += 8;
    else if (university.intlAidPolicy === "need-aware-high-aid") score += 10;
    else score -= 6;
  }

  if (university.meritAid) {
    score += 4;
  }

  return score;
}

function classifyBucket(admissionGap) {
  if (admissionGap >= 13) return "reach";
  if (admissionGap >= 2) return "target";
  return "safety";
}

function buildReason(university, majorFit, aidFit, competitivenessScore) {
  const reasons = [];

  if (majorFit >= 14) {
    reasons.push("strong academic fit with intended major");
  } else if (majorFit >= 10) {
    reasons.push("reasonable major alignment");
  }

  if (aidFit >= 24) {
    reasons.push("excellent financial aid profile for international applicants");
  } else if (aidFit >= 18) {
    reasons.push("solid aid and scholarship positioning");
  } else if (aidFit <= 8) {
    reasons.push("aid is limited, so merit execution is critical");
  }

  if (competitivenessScore >= 80 && university.acceptanceRate <= 0.12) {
    reasons.push("profile can credibly compete at this selectivity");
  }

  if (university.meritAid) {
    reasons.push("has merit scholarship pathways");
  }

  if (reasons.length === 0) {
    reasons.push("balanced option for portfolio diversification");
  }

  return reasons.join("; ");
}

function selectBucket(candidates, bucket, maxCount) {
  return candidates.filter((item) => item.bucket === bucket).slice(0, maxCount);
}

function refillIfNeeded(primary, secondaryPools, maxCount) {
  const result = [...primary];

  for (const pool of secondaryPools) {
    for (const item of pool) {
      if (result.length >= maxCount) {
        return result;
      }
      if (!result.some((existing) => existing.name === item.name)) {
        result.push(item);
      }
    }
  }

  return result;
}

export function generateUniversityRecommendations(profileAnalysis, competitiveness) {
  const { structuredProfile } = profileAnalysis;

  const scored = UNIVERSITY_DATA.map((university) => {
    const majorFit = computeMajorFit(university.strengths, structuredProfile.intendedMajors);
    const aidFit = computeAidFit(university, structuredProfile);
    const difficulty = computeSchoolDifficulty(university.acceptanceRate);
    const adjustedProfileStrength = competitiveness.overallScore + (majorFit * 0.35) + (aidFit * 0.25);
    const admissionGap = difficulty - adjustedProfileStrength;
    const bucket = classifyBucket(admissionGap);

    return {
      ...university,
      difficulty,
      majorFit,
      aidFit,
      adjustedProfileStrength: Math.round(adjustedProfileStrength),
      admissionGap: Math.round(admissionGap),
      bucket,
      fitScore: Math.round(majorFit * 2 + aidFit + (100 - Math.abs(admissionGap)))
    };
  });

  const rankedByFit = scored
    .sort((a, b) => b.fitScore - a.fitScore)
    .map((item) => ({
      name: item.name,
      acceptanceRate: `${Math.round(item.acceptanceRate * 100)}%`,
      acceptanceRateValue: item.acceptanceRate,
      category: item.bucket,
      type: item.type,
      region: item.region,
      aidPolicy: AID_POLICY_LABELS[item.intlAidPolicy],
      reason: buildReason(item, item.majorFit, item.aidFit, competitiveness.overallScore),
      strengths: item.strengths
    }));

  const reachPrimary = selectBucket(rankedByFit, "reach", 6);
  const targetPrimary = selectBucket(rankedByFit, "target", 6);
  const safetyPrimary = selectBucket(rankedByFit, "safety", 5);

  const selectiveFallback = rankedByFit
    .filter((item) => item.acceptanceRateValue <= 0.12)
    .sort((a, b) => a.acceptanceRateValue - b.acceptanceRateValue);

  const broadFallback = rankedByFit
    .filter((item) => item.acceptanceRateValue >= 0.35)
    .sort((a, b) => b.acceptanceRateValue - a.acceptanceRateValue);

  const reachSeed = reachPrimary.length ? reachPrimary : selectiveFallback.slice(0, 5);
  const safetySeed = safetyPrimary.length ? safetyPrimary : broadFallback.slice(0, 4);

  const reach = refillIfNeeded(reachSeed, [targetPrimary, safetyPrimary], 5);
  const target = refillIfNeeded(targetPrimary, [reach, safetySeed], 6);
  const safety = refillIfNeeded(safetySeed, [targetPrimary], 4);

  return {
    reach: reach.map(({ acceptanceRateValue, ...item }) => item),
    target: target.map(({ acceptanceRateValue, ...item }) => item),
    safety: safety.map(({ acceptanceRateValue, ...item }) => item),
    totalRecommended: reach.length + target.length + safety.length
  };
}
