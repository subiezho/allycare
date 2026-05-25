import test from "node:test";
import assert from "node:assert/strict";
import { analyzeStudentProfile, normalizeStudentProfile } from "../server/modules/profileAnalyzer.js";

test("normalizeStudentProfile extracts key metrics", () => {
  const normalized = normalizeStudentProfile({
    profileText:
      "Grade 11 international applicant. GPA 3.92, SAT 1510, TOEFL 108. Need financial aid, budget $20,000. 10 hours per week for extracurriculars. Interested in computer science and economics.",
    profile: {
      opportunities: "robotics lab, NGO partner",
      constraints: "limited budget, no travel"
    }
  });

  assert.equal(normalized.currentGrade, "11");
  assert.equal(normalized.gpa, 3.92);
  assert.equal(normalized.sat, 1510);
  assert.equal(normalized.toefl, 108);
  assert.equal(normalized.budgetUsd, 20000);
  assert.equal(normalized.needFinancialAid, true);
  assert.equal(normalized.weeklyHours, 10);
  assert.deepEqual(normalized.opportunities, ["robotics lab", "NGO partner"]);
  assert.deepEqual(normalized.constraints, ["limited budget", "no travel"]);
});

test("analyzeStudentProfile returns bounded scores and strategic arrays", () => {
  const analysis = analyzeStudentProfile({
    profileText:
      "Grade 12 student with GPA 3.85, SAT 1480. Founder of coding club, national olympiad finalist, and research intern.",
    profile: {
      intendedMajors: "Computer Science",
      isInternational: true,
      needFinancialAid: true
    }
  });

  assert.ok(analysis.scores.overall >= 0 && analysis.scores.overall <= 100);
  assert.ok(Array.isArray(analysis.strengths));
  assert.ok(Array.isArray(analysis.weaknesses));
  assert.ok(Array.isArray(analysis.uniqueAdvantages));
  assert.ok(Array.isArray(analysis.admissionRisks));
});
