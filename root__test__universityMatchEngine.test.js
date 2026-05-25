import test from "node:test";
import assert from "node:assert/strict";
import { analyzeStudentProfile } from "../server/modules/profileAnalyzer.js";
import { evaluateCompetitiveness } from "../server/modules/competitivenessEngine.js";
import { generateUniversityRecommendations } from "../server/modules/universityMatchEngine.js";

test("recommendation engine returns balanced reach/target/safety buckets", () => {
  const profileAnalysis = analyzeStudentProfile({
    profileText:
      "Grade 11 international student, GPA 3.94, SAT 1530, TOEFL 112, founder of education nonprofit and research assistant in AI.",
    profile: {
      intendedMajors: "Computer Science, Economics",
      needFinancialAid: true,
      isInternational: true
    }
  });

  const competitiveness = evaluateCompetitiveness(profileAnalysis);
  const recommendations = generateUniversityRecommendations(profileAnalysis, competitiveness);

  assert.ok(recommendations.reach.length > 0);
  assert.ok(recommendations.target.length > 0);
  assert.ok(recommendations.safety.length > 0);
  assert.ok(recommendations.totalRecommended >= 10);
});
